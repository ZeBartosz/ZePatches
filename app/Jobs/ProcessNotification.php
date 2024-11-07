<?php

namespace App\Jobs;

use App\Models\Favorite;
use App\Models\Notification;
use App\Models\Steam;
use App\Services\SteamService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Syntax\SteamApi\Facades\SteamApi;

class ProcessNotification implements ShouldQueue
{

    use Queueable;

    public $games;

    public function __construct($games)
    {
        $this->games = $games;
    }

    public function handle(): void
    {
        foreach ($this->games as $game) {
            // URL definitions
            $urlEvent = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $game->appId . "&count_before=0&count_after=100&event_type_filter=14";
            $urlPatches = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $game->appId . "&count_before=0&count_after=100&event_type_filter=13";

            // Decode responses
            $eventPatches =  json_decode(file_get_contents($urlEvent), true);
            $patches = json_decode(file_get_contents($urlPatches), true);

            // only for testing 
            // $eventPatches = Http::get($urlEvent)->json();
            // $patches = Http::get($urlPatches)->json();

            $steamModelGame = Steam::where("appId", $game->appId);

            // Process events
            if (!empty($eventPatches["events"])) {
                $unixEventDate = Carbon::createFromTimestamp($eventPatches["events"][0]["announcement_body"]["posttime"])->toDateTimeString();
                $currentEventDate = $game->eventPatchesDate;

                if ($currentEventDate !== $unixEventDate) {
                    $eventName = $eventPatches["events"][0]["announcement_body"]["headline"];

                    $userIds = Favorite::where('steam_id', $game->id)->pluck('user_id');

                    foreach ($userIds as $userId) {
                        Notification::create([
                            'user_id' => $userId,
                            'steam_id' => $game->id,
                            'eventName' => $eventName,
                            'eventPatchesDate' => $unixEventDate,
                            'game' => $game->name,
                            'appId' => $game->appId
                        ]);
                    }

                    $steamModelGame->update(['eventPatchesDate' => $unixEventDate]);
                }
            }

            // Process patches
            if (!empty($patches["events"])) {
                $unixPatchDate = Carbon::createFromTimestamp($patches["events"][0]["announcement_body"]["posttime"])->toDateTimeString();
                $currentPatchDate = $game->patchNotesDate;

                if ($currentPatchDate !== $unixPatchDate) {
                    $patchName = $patches["events"][0]["announcement_body"]["headline"];

                    $userIds = Favorite::where('steam_id', $game->id)->pluck('user_id');

                    foreach ($userIds as $userId) {
                        Notification::create([
                            'user_id' => $userId,
                            'steam_id' => $game->id,
                            'patchName' => $patchName,
                            'patchNotesDate' => $unixPatchDate,
                            'game' => $game->name,
                            'appId' => $game->appId
                        ]);
                    }

                    $steamModelGame->update(['patchNotesDate' => $unixPatchDate]);
                }
            }
        }
    }
}
