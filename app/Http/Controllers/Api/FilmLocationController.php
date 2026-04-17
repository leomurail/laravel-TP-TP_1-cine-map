<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Film;

class FilmLocationController extends Controller
{
    public function index(Film $film)
    {
        return response()->json([
            'film' => [
                'id' => $film->id,
                'title' => $film->title,
                'release_year' => $film->release_year,
                'synopsis' => $film->synopsis,
            ],
            'locations' => $film->locations()->get()->map(function ($location) {
                return [
                    'id' => $location->id,
                    'name' => $location->name,
                    'city' => $location->city,
                    'country' => $location->country,
                    'description' => $location->description,
                    'upvotes_count' => $location->upvotes_count,
                ];
            }),
        ]);
    }
}
