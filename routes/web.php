<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

use App\Http\Controllers\FilmController;
use App\Http\Controllers\LocationController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Films
    Route::get('films', [FilmController::class, 'index'])->name('films.index');
    Route::get('films/{film}', [FilmController::class, 'show'])->name('films.show');
    
    Route::middleware('admin')->group(function () {
        Route::get('films/create', [FilmController::class, 'create'])->name('films.create');
        Route::post('films', [FilmController::class, 'store'])->name('films.store');
        Route::get('films/{film}/edit', [FilmController::class, 'edit'])->name('films.edit');
        Route::put('films/{film}', [FilmController::class, 'update'])->name('films.update');
        Route::delete('films/{film}', [FilmController::class, 'destroy'])->name('films.destroy');
    });

    // Locations
    Route::resource('locations', LocationController::class);
});

require __DIR__.'/settings.php';
