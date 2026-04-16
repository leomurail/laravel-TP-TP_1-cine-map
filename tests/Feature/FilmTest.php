<?php

use App\Models\User;
use App\Models\Film;

test('films index page is displayed', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('films.index'));

    $response->assertOk();
});

test('admin can create a film', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)->post(route('films.store'), [
        'title' => 'Inception',
        'release_year' => 2010,
        'synopsis' => 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    ]);

    $response->assertRedirect(route('films.index'));
    $this->assertDatabaseHas('films', ['title' => 'Inception']);
});

test('normal user cannot create a film', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $response = $this->actingAs($user)->post(route('films.store'), [
        'title' => 'Inception',
        'release_year' => 2010,
        'synopsis' => 'A thief who steals corporate secrets through the use of dream-sharing technology.',
    ]);

    $response->assertStatus(403);
});
