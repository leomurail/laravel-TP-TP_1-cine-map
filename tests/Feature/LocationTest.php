<?php

use App\Models\User;
use App\Models\Film;
use App\Models\Location;

test('locations index page is displayed', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('locations.index'));

    $response->assertOk();
});

test('user can create a location', function () {
    $user = User::factory()->create();
    $film = Film::factory()->create();

    $response = $this->actingAs($user)->post(route('locations.store'), [
        'film_id' => $film->id,
        'name' => 'Paris',
        'city' => 'Paris',
        'country' => 'France',
        'description' => 'Beautiful city',
    ]);

    $response->assertRedirect(route('locations.index'));
    $this->assertDatabaseHas('locations', ['name' => 'Paris', 'user_id' => $user->id]);
});

test('user can edit their own location', function () {
    $user = User::factory()->create();
    $location = Location::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->put(route('locations.update', $location), [
        'film_id' => $location->film_id,
        'name' => 'Updated Paris',
        'city' => 'Paris',
        'country' => 'France',
        'description' => 'Beautiful city',
    ]);

    $response->assertRedirect(route('locations.index'));
    $this->assertDatabaseHas('locations', ['id' => $location->id, 'name' => 'Updated Paris']);
});

test('user cannot edit another user\'s location', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $location = Location::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->put(route('locations.update', $location), [
        'film_id' => $location->film_id,
        'name' => 'Hacked Name',
        'city' => 'Paris',
        'country' => 'France',
        'description' => 'Hacked description',
    ]);

    $response->assertStatus(403);
});

test('admin can edit any location', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $user = User::factory()->create();
    $location = Location::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($admin)->put(route('locations.update', $location), [
        'film_id' => $location->film_id,
        'name' => 'Admin Edited',
        'city' => 'Paris',
        'country' => 'France',
        'description' => 'Admin was here',
    ]);

    $response->assertRedirect(route('locations.index'));
    $this->assertDatabaseHas('locations', ['id' => $location->id, 'name' => 'Admin Edited']);
});
