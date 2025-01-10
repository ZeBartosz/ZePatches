<?php

use App\Jobs\ProcessNotification;
use App\Models\Favorite;
use App\Models\Steam;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NotificationProcessTest extends TestCase
{
    use RefreshDatabase;

    public function testNotificationProcessJobNotifiesMultipleUsers()
    {
        // Arrange: Mock the current time
        $currentTime = Carbon::now();
        Carbon::setTestNow($currentTime);

        // Mock HTTP responses
        Http::fake([
            'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=14' => Http::response([
                'events' => [
                    [
                        'announcement_body' => [
                            'posttime' => $currentTime->timestamp,
                            'headline' => 'New Event Released!',
                        ]
                    ]
                ]
            ], 200),
            'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=13' => Http::response([
                'events' => [
                    [
                        'announcement_body' => [
                            'posttime' => $currentTime->timestamp,
                            'headline' => 'New Patch Released!',
                        ]
                    ]
                ]
            ], 200),
        ]);

        // Create game and users
        $steamGame = Steam::factory()->create(['appId' => 12345]);
        $users = User::factory(3)->create();
        foreach ($users as $user) {
            Favorite::create(['user_id' => $user->id, 'steam_id' => $steamGame->id]);
        }

        // Act: Dispatch the job
        ProcessNotification::dispatch();

        // Assert: Notifications are created for each user
        foreach ($users as $user) {
            $this->assertDatabaseHas('notifications', [
                'user_id' => $user->id,
                'steam_id' => $steamGame->id,
                'eventName' => 'New Event Released!',
                'eventPatchesDate' => $currentTime->toDateTimeString(),
            ]);
            $this->assertDatabaseHas('notifications', [
                'user_id' => $user->id,
                'steam_id' => $steamGame->id,
                'patchName' => 'New Patch Released!',
                'patchNotesDate' => $currentTime->toDateTimeString(),
            ]);
        }

        // Assert: Steam model dates are updated
        $steamGame->refresh();
        $this->assertEquals($currentTime->toDateTimeString(), $steamGame->eventPatchesDate);
        $this->assertEquals($currentTime->toDateTimeString(), $steamGame->patchNotesDate);
    }

    public function testNotificationProcessJobNotifiesMultipleUsersForMultipleGames()
    {
        // Arrange: Mock the current time
        $currentTime = Carbon::now();
        Carbon::setTestNow($currentTime);

        // Mock HTTP responses for multiple games
        Http::fake([
            'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=14' => Http::response([
                'events' => [
                    [
                        'announcement_body' => [
                            'posttime' => $currentTime->timestamp,
                            'headline' => 'New Event for Game 1 Released!',
                        ]
                    ]
                ]
            ], 200),
            'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=67890&count_before=0&count_after=100&event_type_filter=14' => Http::response([
                'events' => [
                    [
                        'announcement_body' => [
                            'posttime' => $currentTime->timestamp,
                            'headline' => 'New Event for Game 2 Released!',
                        ]
                    ]
                ]
            ], 200),
            'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=13' => Http::response([
                'events' => [
                    [
                        'announcement_body' => [
                            'posttime' => $currentTime->timestamp,
                            'headline' => 'New Patch for Game 1 Released!',
                        ]
                    ]
                ]
            ], 200),
            'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=67890&count_before=0&count_after=100&event_type_filter=13' => Http::response([
                'events' => [
                    [
                        'announcement_body' => [
                            'posttime' => $currentTime->timestamp,
                            'headline' => 'New Patch for Game 2 Released!',
                        ]
                    ]
                ]
            ], 200),
        ]);

        // Create multiple games
        $game1 = Steam::factory()->create(['appId' => 12345]);
        $game2 = Steam::factory()->create(['appId' => 67890]);

        // Create users and assign favorites (some will not favorite certain games)
        $users = User::factory(3)->create();
        Favorite::create(['user_id' => $users[0]->id, 'steam_id' => $game1->id]); // User 1 favorites Game 1
        Favorite::create(['user_id' => $users[1]->id, 'steam_id' => $game2->id]); // User 2 favorites Game 2
        // User 3 doesn't favorite any game

        // Act: Dispatch the job to process notifications for multiple games
        ProcessNotification::dispatch();

        // Assert: Notifications for Game 1 are created for User 1
        $this->assertDatabaseHas('notifications', [
            'user_id' => $users[0]->id,
            'steam_id' => $game1->id,
            'eventName' => 'New Event for Game 1 Released!',
            'eventPatchesDate' => $currentTime->toDateTimeString(),
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $users[0]->id,
            'steam_id' => $game1->id,
            'patchName' => 'New Patch for Game 1 Released!',
            'patchNotesDate' => $currentTime->toDateTimeString(),
        ]);

        // Assert: Notifications for Game 2 are created for User 2
        $this->assertDatabaseHas('notifications', [
            'user_id' => $users[1]->id,
            'steam_id' => $game2->id,
            'eventName' => 'New Event for Game 2 Released!',
            'eventPatchesDate' => $currentTime->toDateTimeString(),
        ]);
        $this->assertDatabaseHas('notifications', [
            'user_id' => $users[1]->id,
            'steam_id' => $game2->id,
            'patchName' => 'New Patch for Game 2 Released!',
            'patchNotesDate' => $currentTime->toDateTimeString(),
        ]);

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $users[2]->id,
            'steam_id' => $game2->id,
            'patchName' => 'New Patch for Game 2 Released!',
            'patchNotesDate' => $currentTime->toDateTimeString(),
        ]);

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $users[2]->id,
            'steam_id' => $game2->id,
            'patchName' => 'New Event for Game 2 Released!',
            'patchNotesDate' => $currentTime->toDateTimeString(),
        ]);

        $this->assertDatabaseMissing('favorites', [
            'user_id' => $users[2]->id,
            'steam_id' => $game2->id,
        ]);

        // Assert: Steam model dates are updated
        $game1->refresh();
        $game2->refresh();
        $this->assertEquals($currentTime->toDateTimeString(), $game1->eventPatchesDate);
        $this->assertEquals($currentTime->toDateTimeString(), $game1->patchNotesDate);
        $this->assertEquals($currentTime->toDateTimeString(), $game2->eventPatchesDate);
        $this->assertEquals($currentTime->toDateTimeString(), $game2->patchNotesDate);
    }
}
