<?php

namespace App\Http\Controllers;

use App\Models\Steam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Syntax\SteamApi\Facades\SteamApi;
use Inertia\Inertia;

class SteamController
{

    public function index()
    {
        // Gets details from search query
        $search = request()->get('query', "");
        $games = [];

        // Checks if $search is set
        if ($search) {
            // Retrieves limited games matching the search query paginate by 10
            $games = Steam::findGameByName($search)->paginate(10);
        }

        // Return view with games and search string
        return inertia('Home', ['games' => $games, 'search' => $search]);
    }

    public function fetchGameDetails($appId)
    {
        $game = Steam::where('appId', $appId)->first();

        if ($game->moreDetails === 0) {
            $gameDetails = Steam::getGameDetails($appId);

            $game->update([
                'type' => !empty($gameDetails->type) ? $gameDetails->type : "Unknown Type",
                'banner' => !empty($gameDetails->header) ? $gameDetails->header : "",
                'developer' =>  !empty($gameDetails->developers) ? $gameDetails->developers[0] : "Unknown Developer",
                'releaseDate' => $gameDetails->release->date ?? "Unknown Release Date",
                'moreDetails' => 1,
            ]);
        }

        return response()->json($game);
    }


    public function show($appId)
    {

        $gameName = Steam::findGameByAppId($appId)->name;
        $urlMinor = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $appId . "&count_before=0&count_after=100&event_type_filter=12";

        $urlMajor = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $appId . "&count_before=0&count_after=100&event_type_filter=14";

        // $urlFutureAnnounce = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $appId . "&count_before=0&count_after=100&event_type_filter=16";
        // $FutureAnnounceEvent = json_decode(file_get_contents($urlFutureAnnounce), true);


        $minorPatches = json_decode(file_get_contents($urlMinor), true);
        $majorPatches = json_decode(file_get_contents($urlMajor), true);


        return inertia('Show', ['minorPatches' => $minorPatches, 'majorPatches' => $majorPatches, 'gameName' => $gameName]);
    }

    public function store()
    {
        // Increase the execution time to go through the whole array   
        ini_set('max_execution_time', 500);

        // Get all appIds from Steam
        $steamApps = SteamApi::app()->GetAppList(50);

        // Assuming the returned structure is an array of stdClass objects with 'appid' and 'name'
        foreach ($steamApps as $game) {
            // Access properties using the object notation
            if (isset($game->appid, $game->name)) {
                // Use Create correctly
                Steam::create([
                    'appId' => $game->appid,
                    'name' => $game->name
                ])->searchable();
            }
        }

        // Resets the max execution time back to 60sec  
        ini_set('max_execution_time', 60);
    }
}
