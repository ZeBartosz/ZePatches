<?php

use App\Models\Steam;
use App\Models\Favorite;
use App\Models\Notification;
use App\Models\User;
use App\Jobs\NotificationProcess;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class NotificationProcessTest extends TestCase
{
    use RefreshDatabase;

    public function testNotificationProcessJobNotifiesMultipleUsers()
    {
        // Arrange: Use a fixed current time for consistency
        $currentTime = Carbon::now();
        Carbon::setTestNow($currentTime);

        // Mock HTTP responses for the event and patch URLs
        Http::fake([
            'store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=14' => Http::response([
                'events' => [
                    [
                        'announcement_body' => [
                            'posttime' => $currentTime->timestamp,
                            'headline' => 'New Event Released!',
                        ]
                    ]
                ]
            ], 200),
            'store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=13' => Http::response([
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

        // Create the Steam game and multiple users who have favorited it
        $steamGame = Steam::factory()->create(['appId' => 12345]);
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        // Add the game to each user's favorites
        Favorite::create(['user_id' => $user1->id, 'steam_id' => $steamGame->id]);
        Favorite::create(['user_id' => $user2->id, 'steam_id' => $steamGame->id]);
        Favorite::create(['user_id' => $user3->id, 'steam_id' => $steamGame->id]);

        // Act: Dispatch the job immediately for testing
        NotificationProcess::dispatch([$steamGame]);

        // Assert: Check that each user has received a notification for the new event and patch
        foreach ([$user1, $user2, $user3] as $user) {
            $this->assertDatabaseHas('notifications', [
                'user_id' => $user->id,
                'steam_id' => $steamGame->id,
                'EventName' => 'New Event Released!',
                'eventPatchesDate' => $currentTime->toDateTimeString(),
            ]);

            $this->assertDatabaseHas('notifications', [
                'user_id' => $user->id,
                'steam_id' => $steamGame->id,
                'patchName' => 'New Patch Released!',
                'patchNotesDate' => $currentTime->toDateTimeString(),
            ]);
        }

        // Verify that the event date and patch date were updated on the Steam model
        $this->assertEquals($currentTime->toDateTimeString(), $steamGame->fresh()->eventPatchesDate);
        $this->assertEquals($currentTime->toDateTimeString(), $steamGame->fresh()->patchNotesDate);
    }
}
