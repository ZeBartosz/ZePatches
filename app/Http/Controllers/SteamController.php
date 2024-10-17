<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessSteam;
use App\Models\Steam;
use App\Services\SteamService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Syntax\SteamApi\Facades\SteamApi;
use Inertia\Inertia;

class SteamController
{
    public function __construct(protected SteamService $steamService) {}

    public function index()
    {
        // Gets details from search query
        $search = request()->get('query', "");

        $games = $this->steamService->getSearchedGames($search);

        // Return view with games and search string
        return inertia('Home', ['games' => $games, 'search' => $search]);
    }

    public function fetchGameDetails($appId)
    {
        $game = Steam::where('appId', $appId)->first();

        if ($game->moreDetails === 0) {
            $this->steamService->getGameDetails($game);
        }

        return response()->json($game);
    }


    public function show($appId)
    {
        $gamePatches = $this->steamService->getPatches($appId);

        return inertia('Show', ['minorPatches' => $gamePatches['minorPatches'], 'majorPatches' => $gamePatches['majorPatches'], 'gameName' => $gamePatches['gameName']]);
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
