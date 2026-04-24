<?php

namespace App\Http\Controllers;

use App\Mcp\Servers\CineMapServer;
use App\Mcp\Tools\GetLocationsForFilmTool;
use App\Mcp\Tools\ListFilmsTool;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /**
     * Handle the incoming chat request using Zen (OpenCode) as an autonomous agent.
     */
    public function __invoke(Request $request)
    {
        $userMessage = $request->input('message');
        $apiKey = config('services.zen.key');
        $model = $request->input('model') ?? config('services.zen.model');
        $baseUrl = config('services.zen.base_url');

        if (! $apiKey) {
            return response()->json(['response' => "Oups ! La clé API Zen n'est pas configurée dans le fichier .env. Veuillez ajouter ZEN_API_KEY."]);
        }

        try {
            $messages = [
                ['role' => 'user', 'content' => $userMessage],
            ];

            $maxIterations = 5;
            $iteration = 0;
            $finalText = null;

            while ($iteration < $maxIterations) {
                $iteration++;

                // Call Zen with current conversation history
                $response = $this->callZen($messages, $apiKey, $model, $baseUrl);
                $data = $response->json();

                Log::info("Iteration $iteration - Zen AI Response:", ['data' => $data]);

                $message = $data['choices'][0]['message'];
                $messages[] = $message; // Add AI response to history

                // Check if AI wants to call tools
                if (! empty($message['tool_calls'])) {
                    Log::info("Iteration $iteration - AI is calling tools:", ['tool_calls' => $message['tool_calls']]);

                    foreach ($message['tool_calls'] as $toolCall) {
                        $toolName = $toolCall['function']['name'];
                        $arguments = json_decode($toolCall['function']['arguments'], true) ?? [];

                        // Execute the tool via our CineMapServer
                        $toolResult = $this->executeMcpTool($toolName, $arguments);
                        Log::info("Iteration $iteration - Tool Result for $toolName:", ['result' => $toolResult]);

                        $messages[] = [
                            'tool_call_id' => $toolCall['id'],
                            'role' => 'tool',
                            'name' => $toolName,
                            'content' => $toolResult,
                        ];
                    }

                    // Continue the loop to send tool results back to AI
                    continue;
                }

                // If no tool calls, we have our final response
                $finalText = $message['content'];
                break;
            }

            return response()->json(['response' => $finalText ?: "Désolé, je n'ai pas pu terminer ma réflexion."]);

        } catch (RequestException $e) {
            Log::error('Zen API Request Error: '.$e->getMessage());

            return response()->json(['response' => 'Erreur de communication avec Zen : '.$e->getMessage()]);
        } catch (\Exception $e) {
            Log::error('ChatBot Error: '.$e->getMessage());

            return response()->json(['response' => "Désolé, j'ai rencontré une difficulté technique. ".$e->getMessage()]);
        }
    }

    private function callZen(array $messages, $apiKey, $model, $baseUrl)
    {
        $systemMessage = [
            'role' => 'system',
            'content' => 'Tu es l\'assistant CineMap. Tu aides les utilisateurs à trouver des informations sur les films et les lieux de tournage. Si un utilisateur te demande les lieux d\'un film par son nom, utilise d\'abord list_films_tool pour trouver l\'ID du film, puis utilise get_locations_for_film_tool avec cet ID.',
        ];

        return Http::withToken($apiKey)->post("{$baseUrl}/chat/completions", [
            'model' => $model,
            'messages' => array_merge([$systemMessage], $messages),
            'tools' => $this->getToolsDefinition(),
            'tool_choice' => 'auto',
        ])->throw();
    }

    private function executeMcpTool($name, $arguments)
    {
        $map = [
            'list_films_tool' => ListFilmsTool::class,
            'get_locations_for_film_tool' => GetLocationsForFilmTool::class,
        ];

        $tool = $map[$name] ?? $name;

        $response = CineMapServer::tool($tool, $arguments);

        $reflection = new \ReflectionClass($response);
        $property = $reflection->getProperty('response');
        $underlyingResponse = $property->getValue($response);

        $data = $underlyingResponse->toArray();

        return $data['result']['content'][0]['text'] ?? '';
    }

    private function getToolsDefinition()
    {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'list_films_tool',
                    'description' => 'List all films in the CineMap database',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => new \stdClass,
                    ],
                ],
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_locations_for_film_tool',
                    'description' => 'Get all filming locations for a specific film',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'film_id' => [
                                'type' => 'number',
                                'description' => 'The ID of the film',
                            ],
                        ],
                        'required' => ['film_id'],
                    ],
                ],
            ],
        ];
    }
}
