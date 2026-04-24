<?php

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get all film locations for a specific film')]
class GetLocationsForFilmTool extends Tool
{
    /**
     * Handle the tool request.
     */
    public function handle(Request $request): Response
    {
        $filmId = $request->get('film_id');
        $locations = \App\Models\Location::where('film_id', $filmId)
            ->select('id', 'name', 'city', 'country', 'description', 'upvotes_count')
            ->get();

        return Response::text(json_encode($locations, JSON_PRETTY_PRINT));
    }

    /**
     * Get the tool's input schema.
     *
     * @return array<string, mixed>
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'film_id' => $schema->number()
                ->description('The ID of the film')
                ->required(),
        ];
    }
}
