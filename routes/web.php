<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

use App\Http\Controllers\SocialController;
use App\Http\Controllers\SubscriptionController;

Route::get('auth/{provider}', [SocialController::class, 'redirectToProvider'])->name('auth.social');
Route::get('auth/{provider}/callback', [SocialController::class, 'handleProviderCallback']);

use App\Http\Controllers\FilmController;
use App\Http\Controllers\LocationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::post('subscription/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::get('subscription/success', [SubscriptionController::class, 'success'])->name('subscription.success');

    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Films
    Route::get('films', [FilmController::class, 'index'])->name('films.index');

    Route::middleware('admin')->group(function () {
        Route::get('films/create', [FilmController::class, 'create'])->name('films.create');
        Route::post('films', [FilmController::class, 'store'])->name('films.store');
        Route::get('films/{film}/edit', [FilmController::class, 'edit'])->name('films.edit');
        Route::put('films/{film}', [FilmController::class, 'update'])->name('films.update');
        Route::delete('films/{film}', [FilmController::class, 'destroy'])->name('films.destroy');
    });

    Route::get('films/{film}', [FilmController::class, 'show'])->name('films.show');

    // Locations
    Route::resource('locations', LocationController::class);
    Route::post('locations/{location}/upvote', [LocationController::class, 'upvote'])->name('locations.upvote');
    // Chatbot
    Route::post('/chat', \App\Http\Controllers\ChatController::class)->name('chat');
});

require __DIR__.'/settings.php';
