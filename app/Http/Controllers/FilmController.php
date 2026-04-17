<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFilmRequest;
use App\Http\Requests\UpdateFilmRequest;
use App\Models\Film;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FilmController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('films/index', [
            'films' => Film::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('films/create');
    }

    public function store(StoreFilmRequest $request): RedirectResponse
    {
        Film::create($request->validated());

        return redirect()->route('films.index')->with('success', 'Film créé avec succès.');
    }

    public function show(Film $film): Response
    {
        return Inertia::render('films/show', [
            'film' => $film->load('locations.user'),
        ]);
    }

    public function edit(Film $film): Response
    {
        return Inertia::render('films/edit', [
            'film' => $film,
        ]);
    }

    public function update(UpdateFilmRequest $request, Film $film): RedirectResponse
    {
        $film->update($request->validated());

        return redirect()->route('films.index')->with('success', 'Film mis à jour avec succès.');
    }

    public function destroy(Film $film): RedirectResponse
    {
        $film->delete();

        return redirect()->route('films.index')->with('success', 'Film supprimé avec succès.');
    }
}
