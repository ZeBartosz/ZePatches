<?php

use App\Jobs\ProcessCheckedNotifications;
use App\Models\Notification;
use App\Models\Steam;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

uses(RefreshDatabase::class);

it('Process to check a notifications has been delete when checked is true', function () {
    $steamGame = Steam::factory()->create(['appId' => 12345, 'name' => 'aaaa']);

    $users = \App\Models\User::factory(1)->create();

    $notification1 = Notification::create([
        'user_id' => $users[0]->id,
        'steam_id' => $steamGame->id,
        'checked' => false,
        'game' => $steamGame->name,
        'appId' => $steamGame->appId,
        'checked' => true,
    ]);

    ProcessCheckedNotifications::dispatch();

    assertDatabaseMissing('notifications', ['id' => $notification1->id]);
});

it('Checks if only data which has one get deleted', function () {
    $steamGame = Steam::factory()->create(['appId' => 12345, 'name' => 'aaaa']);

    $users = \App\Models\User::factory(2)->create();

    $notification1 = Notification::create([
        'user_id' => $users[0]->id,
        'steam_id' => $steamGame->id,
        'checked' => true,
        'game' => $steamGame->name,
        'appId' => $steamGame->appId,
    ]);

    $notification2 = Notification::create([
        'user_id' => $users[1]->id,
        'steam_id' => $steamGame->id,
        'checked' => false,
        'game' => $steamGame->name,
        'appId' => $steamGame->appId,
    ]);

    ProcessCheckedNotifications::dispatch();

    assertDatabaseMissing('notifications', ['id' => $notification1->id]);
    assertDatabaseHas('notifications', ['id' => $notification2->id]);
});
