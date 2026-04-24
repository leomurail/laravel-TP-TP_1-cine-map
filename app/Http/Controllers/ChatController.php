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
     * Handle the incoming chat request using Gemini 2.0 Flash Lite as an agent.
     */
    public function __invoke(Request $request)
    {
        $userMessage = $request->input('message');
        $apiKey = config('services.gemini.key');
        $model = $request->input('model') ?? config('services.gemini.model');

        if (! $apiKey) {
            return response()->json(['response' => "Oups ! La clé API Gemini n'est pas configurée dans le fichier .env. Veuillez ajouter GEMINI_API_KEY."]);
        }

        try {
            // 1. Initial call to Gemini with tools description
            $response = $this->callGemini($userMessage, $apiKey, $model);

            if ($response->status() === 429) {
                Log::error('Gemini API Quota Exceeded: '.$response->body());

                return response()->json(['response' => "Désolé, j'ai dépassé mon quota de messages. Veuillez réessayer dans quelques instants ou vérifier votre configuration."]);
            }
            // If it reached here but failed for some other reason not caught by throw() (unlikely with throw())
            if ($response->failed()) {
                Log::error('Gemini API Error: '.$response->body());

                return response()->json(['response' => 'Erreur lors de la communication avec Gemini. Vérifiez votre clé API ou réessayez plus tard.']);
            }

            $candidate = $response->json('candidates.0');
            $parts = $candidate['content']['parts'] ?? [];
            $finalText = '';

            foreach ($parts as $part) {
                if (isset($part['text'])) {
                    $finalText .= $part['text'];
                }

                // 2. Handle Function (Tool) Call
                if (isset($part['functionCall'])) {
                    $toolName = $part['functionCall']['name'];
                    $arguments = $part['functionCall']['args'] ?? [];

                    // Execute the tool via our CineMapServer
                    $toolResult = $this->executeMcpTool($toolName, $arguments);

                    // 3. Send tool result back to Gemini for final response
                    $finalResponse = $this->callGeminiWithToolResult(
                        $userMessage,
                        $toolName,
                        $toolResult,
                        $apiKey,
                        $model
                    );

                    // No need for failed check here if we use throw() below

                    $finalText = $finalResponse->json('candidates.0.content.parts.0.text');
                }
            }

            return response()->json(['response' => $finalText ?: "Je n'ai pas pu générer de réponse."]);

        } catch (RequestException $e) {
            if ($e->response->status() === 429) {
                Log::error('Gemini API Quota Exceeded (Exception): '.$e->response->body());

                return response()->json(['response' => "Désolé, j'ai dépassé mon quota de messages Gemini. Veuillez réessayer dans quelques instants ou vérifier votre configuration dans le fichier .env."]);
            }
            Log::error('Gemini API Request Error: '.$e->getMessage());

            return response()->json(['response' => "Erreur de communication avec l'API : ".$e->getMessage()]);
        } catch (\Exception $e) {
            Log::error('ChatBot Error: '.$e->getMessage());

            return response()->json(['response' => "Désolé, j'ai rencontré une difficulté technique. ".$e->getMessage()]);
        }
    }

    private function callGemini($message, $apiKey, $model)
    {
        return Http::retry(3, 1000)->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $message]],
                ],
            ],
            'tools' => [
                ['function_declarations' => $this->getToolsDefinition()],
            ],
            'tool_config' => [
                'function_calling_config' => ['mode' => 'AUTO'],
            ],
        ])->throw();
    }

    private function executeMcpTool($name, $arguments)
    {
        // Using CineMapServer's testing capability to run tools programmatically
        $response = CineMapServer::tool($name, $arguments);

        return $response->getContent();
    }

    private function callGeminiWithToolResult($userMessage, $toolName, $result, $apiKey, $model)
    {
        return Http::retry(3, 1000)->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $userMessage]],
                ],
                [
                    'role' => 'model',
                    'parts' => [
                        [
                            'functionCall' => [
                                'name' => $toolName,
                                'args' => new \stdClass,
                            ],
                        ],
                    ],
                ],
                [
                    'role' => 'user',
                    'parts' => [
                        [
                            'functionResponse' => [
                                'name' => $toolName,
                                'response' => ['content' => $result],
                            ],
                        ],
                    ],
                ],
            ],
            'tools' => [
                ['function_declarations' => $this->getToolsDefinition()],
            ],
        ])->throw();
    }

    private function getToolsDefinition()
    {
        return [
            [
                'name' => 'list-films-tool',
                'description' => 'List all films in the CineMap database',
                'parameters' => [
                    'type' => 'object',
                    'properties' => (object) [],
                ],
            ],
            [
                'name' => 'get-locations-for-film-tool',
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
        ];
    }
}
