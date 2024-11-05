<?php

namespace App\Jobs;

use App\Models\Favorite;
use App\Models\Notification;
use App\Models\Steam;
use App\Services\SteamService;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Syntax\SteamApi\Facades\SteamApi;

class NotificationProcess implements ShouldQueue
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
            // url 
            $urlEvent = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $game->appId . "&count_before=0&count_after=100&event_type_filter=14";
            $urlPatches = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $game->appId . "&count_before=0&count_after=100&event_type_filter=13";

            // decode
            $eventPatches = json_decode(file_get_contents($urlEvent), true);
            $patches = json_decode(file_get_contents($urlPatches), true);

            if (!empty($eventPatches["events"])) {

                $unixEventDate = Carbon::createFromTimestamp($eventPatches["events"][0]["announcement_body"]["posttime"])->toDateTimeString() ?? null;

                $currectEventDate = $game->eventPatchesDate;

                if ($currectEventDate !== $unixEventDate) {

                    $eventName = $eventPatches["events"][0]["announcement_body"]["headline"];

                    $userIds = Favorite::where('steam_id', $game->id)
                        ->get()
                        ->pluck('user_id');

                    foreach ($userIds as $userId) {
                        Notification::create([
                            'user_id' => $userId,
                            'steam_id' => $game->id,
                            'EventName' => $eventName,
                            'eventPatchesDate' => $unixEventDate,
                        ]);
                    }

                    $game->update([
                        'eventPatchesDate' => $unixEventDate,
                    ]);
                }
            }

            if (!empty($unixEventDate["events"])) {
                $unixPatchDate = Carbon::createFromTimestamp($patches["events"][0]["announcement_body"]["posttime"])->toDateTimeString() ?? null;
            }
        }
    }
}
