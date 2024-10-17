<?php

namespace App\Jobs;

use App\Models\Steam;
use App\Services\SteamService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Syntax\SteamApi\Facades\SteamApi;

class ProcessSteam implements ShouldQueue
{

    use Queueable;

    public function handle(): void
    {

        $steamApps = SteamApi::app()->GetAppList();
        $appIdCollection = collect($steamApps)->pluck('appid')->filter()->take(500)->toArray();
        // $gamesWithDetails = SteamApi::app()->appDetails($appIdCollection)->get();
        $num = 0;

        foreach ($appIdCollection as $appId) {
            $gamesWithDetails = SteamApi::app()->appDetails($appId)->first();
            $num++;
            log::info("number of api calls" . $num);
        }

        // Assuming the returned structure is an array of stdClass objects with 'appid' and 'name'
        // foreach ($gamesWithDetails as $game) {

        //     // Access properties using the object notation
        //     if (isset($game->id, $game->name)) {
        //         https://store.steampowered.com/api/appdetails?appids=
        //         // Use Create correctly
        //         Steam::updateOrCreate([
        //             'appId' => $game->id,
        //             'name' => $game->name,
        //             'type' => !empty($game->type) ? $game->type : "Unknown Type",
        //             'banner' => !empty($game->header) ? $game->header : "",
        //             'developer' =>  !empty($game->developers) ? $game->developers[0] : "Unknown Developer",
        //             'releaseDate' => $game->release->date ?? "Unknown Release Date",
        //             'moreDetails' => 1,
        //         ])->searchable();
        //     }
        // }
    }
}
