<?php

use App\Http\Controllers\Api\FilmLocationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api', 'subscribed'])->group(function () {
    Route::get('/films/{film}/locations', [FilmLocationController::class, 'index']);
});

// Route for getting a token (for demonstration)
Route::post('/login', function (Request $request) {
    $credentials = $request->only('email', 'password');

    if (! $token = auth('api')->attempt($credentials)) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    return response()->json([
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => auth('api')->factory()->getTTL() * 60,
    ]);
});
