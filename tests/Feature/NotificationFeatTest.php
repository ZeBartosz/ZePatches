<?php

use App\Models\Notification;
use App\Models\Steam;
use App\Models\User;

it('updates notifications to checked for single users and games', function () {
    $steamGame = Steam::factory()->create(['appId' => 12345, 'name' => 'aaaa']);

    $users = User::factory(1)->create();

    $notification1 = Notification::create([
        'user_id' => $users[0]->id,
        'steam_id' => $steamGame->id,
        'checked' => false,
        'game' => $steamGame->name,
        'appId' => $steamGame->appId,
    ]);


    $response = $this->putJson('/notifications/updateChecked', [
        'notificationId' => [$notification1->id],
    ]);

    $notification1->refresh();

    $this->assertDatabaseHas('notifications', [
        'user_id' => $users[0]->id,
        'steam_id' => $steamGame->id,
        'checked' => true,
    ]);

    $response->assertStatus(200);
});

it('updates notifications to checked for multiple users and games', function () {
    $steamGame = Steam::factory()->create(['appId' => 12345, 'name' => 'aaaa']);

    $users = User::factory(3)->create();

    $notification1 = Notification::create([
        'user_id' => $users[0]->id,
        'steam_id' => $steamGame->id,
        'checked' => false,
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

    $notification3 = Notification::create([
        'user_id' => $users[2]->id,
        'steam_id' => $steamGame->id,
        'checked' => false,
        'game' => $steamGame->name,
        'appId' => $steamGame->appId,
    ]);

    $response = $this->putJson('/notifications/updateChecked', [
        'notificationId' => [$notification1->id, $notification2->id, $notification3->id],
    ]);


    $notification1->refresh();
    $notification2->refresh();
    $notification3->refresh();

    $this->assertDatabaseHas('notifications', [
        'user_id' => $users[0]->id,
        'steam_id' => $steamGame->id,
        'checked' => true,
    ]);
    $this->assertDatabaseHas('notifications', [
        'user_id' => $users[1]->id,
        'steam_id' => $steamGame->id,
        'checked' => true,
    ]);
    $this->assertDatabaseHas('notifications', [
        'user_id' => $users[2]->id,
        'steam_id' => $steamGame->id,
        'checked' => true,
    ]);

    $response->assertStatus(200);
});


