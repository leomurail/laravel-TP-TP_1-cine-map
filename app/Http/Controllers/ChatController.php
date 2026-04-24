<?php

namespace App\Http\Controllers;

use App\Mcp\Servers\CineMapServer;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    /**
     * Handle the incoming chat request using Zen (OpenCode) as an agent.
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
            // 1. Initial call to Zen with tools
            $response = $this->callZen([
                ['role' => 'user', 'content' => $userMessage]
            ], $apiKey, $model, $baseUrl);

            $data = $response->json();
            $message = $data['choices'][0]['message'];

            // 2. Handle Tool Calls
            if (!empty($message['tool_calls'])) {
                $messages = [
                    ['role' => 'user', 'content' => $userMessage],
                    $message
                ];

                foreach ($message['tool_calls'] as $toolCall) {
                    $toolName = $toolCall['function']['name'];
                    $arguments = json_decode($toolCall['function']['arguments'], true) ?? [];

                    // Execute the tool via our CineMapServer
                    $toolResult = $this->executeMcpTool($toolName, $arguments);

                    $messages[] = [
                        'tool_call_id' => $toolCall['id'],
                        'role' => 'tool',
                        'name' => $toolName,
                        'content' => $toolResult,
                    ];
                }

                // 3. Final call with tool results
                $finalResponse = $this->callZen($messages, $apiKey, $model, $baseUrl);
                $finalText = $finalResponse->json('choices.0.message.content');
            } else {
                $finalText = $message['content'];
            }

            return response()->json(['response' => $finalText ?: "Je n'ai pas pu générer de réponse."]);

        } catch (RequestException $e) {
            Log::error('Zen API Request Error: '.$e->getMessage());
            return response()->json(['response' => "Erreur de communication avec Zen : ".$e->getMessage()]);
        } catch (\Exception $e) {
            Log::error('ChatBot Error: '.$e->getMessage());
            return response()->json(['response' => "Désolé, j'ai rencontré une difficulté technique. ".$e->getMessage()]);
        }
    }

    private function callZen(array $messages, $apiKey, $model, $baseUrl)
    {
        return Http::withToken($apiKey)->post("{$baseUrl}/chat/completions", [
            'model' => $model,
            'messages' => $messages,
            'tools' => $this->getToolsDefinition(),
            'tool_choice' => 'auto',
        ])->throw();
    }

    private function executeMcpTool($name, $arguments)
    {
        $map = [
            'list_films_tool' => \App\Mcp\Tools\ListFilmsTool::class,
            'get_locations_for_film_tool' => \App\Mcp\Tools\GetLocationsForFilmTool::class,
        ];

        $tool = $map[$name] ?? $name;

        $response = CineMapServer::tool($tool, $arguments);

        return $response->getContent();
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
                        'properties' => (object) [],
                    ],
                ]
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
                ]
            ],
        ];
    }
}
