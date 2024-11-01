<?php

namespace App\Services;

use App\Models\Steam;
use Carbon\Carbon;

class FavoriteService
{


    public function updateGamePatchDate($steam)
    {

        // url 
        $urlEvent = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $steam->appId . "&count_before=0&count_after=100&event_type_filter=14";
        $urlPatches = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $steam->appId . "&count_before=0&count_after=100&event_type_filter=13";

        // decode
        $eventPatches = json_decode(file_get_contents($urlEvent), true);
        $patches = json_decode(file_get_contents($urlPatches), true);

        // Change from unix to readable date
        $unixEventDate = Carbon::createFromTimestamp($eventPatches["events"][0]["announcement_body"]["posttime"])->toDateTimeString();
        $unixPatchDate = Carbon::createFromTimestamp($patches["events"][0]["announcement_body"]["posttime"])->toDateTimeString();

        // update steam model 
        $steam->update([
            "eventPatchesDate" => $unixEventDate,
            "patchNotesDate" => $unixPatchDate
        ]);
    }
}
