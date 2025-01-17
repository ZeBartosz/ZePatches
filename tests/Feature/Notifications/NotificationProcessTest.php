<?php

use App\Jobs\ProcessNotification;
use App\Models\Favorite;
use App\Models\Steam;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

uses(RefreshDatabase::class);


it('notifies multiple users', function () {

    $currentTime = Carbon::now();
    Carbon::setTestNow($currentTime);

    Http::fake([
        'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=13' => Http::response([
            'events' => [
                [
                    'announcement_body' => [
                        'posttime' => $currentTime->timestamp,
                        'headline' => 'New Event Released!',
                    ]
                ]
            ]
        ], 200),
        'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=12' => Http::response([
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
    $steamGame = Steam::factory()->create(['appId' => 12345]);
    $users = User::factory(3)->create();

    $users->each(function ($user) use ($steamGame) {
        Favorite::create(['user_id' => $user->id, 'steam_id' => $steamGame->id]);
    });

    ProcessNotification::dispatch();

    $users->each(function ($user) use ($currentTime, $steamGame) {
        expect(assertDatabaseHas('notifications', [
            'user_id' => $user->id,
            'steam_id' => $steamGame->id,
            'PatchName' => 'New Patch Released!',
            'patchNotesDate' => $currentTime->toDateTimeString(),
        ]))
            ->and(assertDatabaseHas('notifications', [
                'user_id' => $user->id,
                'steam_id' => $steamGame->id,
                'eventName' => 'New Event Released!',
                'eventPatchesDate' => $currentTime->toDateTimeString(),
            ]));
    });


    $steamGame->refresh();

    expect($steamGame->eventPatchesDate)->toEqual($currentTime->toDateTimeString())
        ->and($steamGame->patchNotesDate)->toEqual($currentTime->toDateTimeString());
});

it('notifies multiple users for multiple games', function () {

    $currentTime = Carbon::now();
    Carbon::setTestNow($currentTime);

    Http::fake([
        'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=13' => Http::response([
            'events' => [
                [
                    'announcement_body' => [
                        'posttime' => $currentTime->timestamp,
                        'headline' => 'New Event for Game 1 Released!',
                    ]
                ]
            ]
        ], 200),
        'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=67890&count_before=0&count_after=100&event_type_filter=13' => Http::response([
            'events' => [
                [
                    'announcement_body' => [
                        'posttime' => $currentTime->timestamp,
                        'headline' => 'New Event for Game 2 Released!',
                    ]
                ]
            ]
        ], 200),
        'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=12345&count_before=0&count_after=100&event_type_filter=12' => Http::response([
            'events' => [
                [
                    'announcement_body' => [
                        'posttime' => $currentTime->timestamp,
                        'headline' => 'New Patch for Game 1 Released!',
                    ]
                ]
            ]
        ], 200),
        'https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=67890&count_before=0&count_after=100&event_type_filter=12' => Http::response([
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

    $game1 = Steam::factory()->create(['appId' => 12345]);
    $game2 = Steam::factory()->create(['appId' => 67890]);

    $users = User::factory(3)->create();
    Favorite::create(['user_id' => $users[0]->id, 'steam_id' => $game1->id]); // User 1 favorites Game 1
    Favorite::create(['user_id' => $users[1]->id, 'steam_id' => $game2->id]); // User 2 favorites Game 2


    ProcessNotification::dispatch();

    expect(assertDatabaseHas('notifications', [
        'user_id' => $users[0]->id,
        'steam_id' => $game1->id,
        'eventName' => 'New Event for Game 1 Released!',
        'eventPatchesDate' => $currentTime->toDateTimeString(),
    ]))
        ->and(assertDatabaseHas('notifications', [
            'user_id' => $users[0]->id,
            'steam_id' => $game1->id,
            'PatchName' => 'New Patch for Game 1 Released!',
            'patchNotesDate' => $currentTime->toDateTimeString(),
        ]))
        ->and(assertDatabaseHas('notifications', [
            'user_id' => $users[1]->id,
            'steam_id' => $game2->id,
            'eventName' => 'New Event for Game 2 Released!',
            'eventPatchesDate' => $currentTime->toDateTimeString(),
        ]))
        ->and(assertDatabaseHas('notifications', [
            'user_id' => $users[1]->id,
            'steam_id' => $game2->id,
            'PatchName' => 'New Patch for Game 2 Released!',
            'patchNotesDate' => $currentTime->toDateTimeString(),
        ]));

    assertDatabaseMissing('notifications', [
        'user_id' => $users[2]->id,
        'steam_id' => $game2->id,
    ]);

    $game1->refresh();
    $game2->refresh();

    expect($game1->eventPatchesDate)->toEqual($currentTime->toDateTimeString())
        ->and($game1->patchNotesDate)->toEqual($currentTime->toDateTimeString())
        ->and($game2->eventPatchesDate)->toEqual($currentTime->toDateTimeString())
        ->and($game2->patchNotesDate)->toEqual($currentTime->toDateTimeString());
});
