<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLocationRequest;
use App\Http\Requests\UpdateLocationRequest;
use App\Jobs\UpdateLocationUpvotes;
use App\Models\Film;
use App\Models\Location;
use App\Models\LocationVote;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    use AuthorizesRequests;

    public function upvote(Request $request, Location $location): RedirectResponse
    {
        $voted = LocationVote::where('user_id', $request->user()->id)
            ->where('location_id', $location->id)
            ->exists();

        if (! $voted) {
            LocationVote::create([
                'user_id' => $request->user()->id,
                'location_id' => $location->id,
            ]);

            UpdateLocationUpvotes::dispatch($location);

            return back()->with('success', 'Vote enregistré !');
        }

        return back()->with('error', 'Vous avez déjà voté pour cet emplacement.');
    }

    public function index(): Response
    {
        return Inertia::render('locations/index', [
            'locations' => Location::with(['film', 'user'])->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('locations/create', [
            'films' => Film::all(),
        ]);
    }

    public function store(StoreLocationRequest $request): RedirectResponse
    {
        $request->user()->locations()->create($request->validated());

        return redirect()->route('locations.index')->with('success', 'Emplacement créé avec succès.');
    }

    public function show(Location $location): Response
    {
        return Inertia::render('locations/show', [
            'location' => $location->load(['film', 'user']),
        ]);
    }

    public function edit(Location $location): Response
    {
        $this->authorize('update', $location);

        return Inertia::render('locations/edit', [
            'location' => $location,
            'films' => Film::all(),
        ]);
    }

    public function update(UpdateLocationRequest $request, Location $location): RedirectResponse
    {
        $this->authorize('update', $location);

        $location->update($request->validated());

        return redirect()->route('locations.index')->with('success', 'Emplacement mis à jour avec succès.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        $this->authorize('delete', $location);

        $location->delete();

        return redirect()->route('locations.index')->with('success', 'Emplacement supprimé avec succès.');
    }
}
