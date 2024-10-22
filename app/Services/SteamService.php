<?php

namespace App\Services;

use App\Jobs\ProcessSteam;
use App\Models\Steam;
use Illuminate\Support\Facades\Auth;
use Syntax\SteamApi\Facades\SteamApi;

class SteamService
{

    //
    public function getSearchedGames(String $search)
    {
        // Checks if $search is set
        if (!$search) {
            // Gets the users favorite games
            return $this->findFavoriteGame();
        }

        // Retrieves limited games matching the search query paginate by 10
        return $this->findGameByName($search)->paginate(10);
    }

    //
    public function getGameDetails($game)
    {
        $id = +$game->appId;
        $gameDetails = SteamApi::app()->appDetails($id)->first();;

        $game->update([
            'type' => !empty($gameDetails->type) ? $gameDetails->type : "Unknown Type",
            'banner' => !empty($gameDetails->header) ? $gameDetails->header : "",
            'developer' =>  !empty($gameDetails->developers) ? $gameDetails->developers[0] : "Unknown Developer",
            'releaseDate' => $gameDetails->release->date ?? "Unknown Release Date",
            'moreDetails' => 1,
        ]);
    }

    //
    public function getPatches($appId)
    {

        $gameName = $this->findGameByAppId($appId)->name;

        $urlMinor = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $appId . "&count_before=0&count_after=100&event_type_filter=13";
        $urlMajor = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=" . $appId . "&count_before=0&count_after=100&event_type_filter=14";

        $minorPatches = json_decode(file_get_contents($urlMinor), true);
        $majorPatches = json_decode(file_get_contents($urlMajor), true);

        return [
            'majorPatches' => $majorPatches,
            'minorPatches' => $minorPatches,
            'gameName' => $gameName
        ];
    }

    //
    public function findGameByName(String $game)
    {
        return Steam::search($game)->query(function ($query) {
            $query->orderByRaw("
            CASE 
                WHEN type = 'game' THEN 0
                WHEN type = 'dlc' THEN 1
                WHEN type = 'Unknown Type' THEN 3
                ELSE 2
            END
                ")->orderByRaw('LENGTH(name) ASC');
        });
    }

    // Find users favorited games
    public function findFavoriteGame()
    {

        // Check if user is logged in
        if (!Auth::user()) {
            return [];
        };

        // Gets the list of favorites games (favoritesDB)
        $favorites = Auth::user()->favorites;

        // Pluck out the ids 
        $favoriteIds = $favorites->pluck('steam_id');
        // Search for the games with the ids 
        return Steam::whereIn('id', $favoriteIds)->paginate(10);
    }

    //
    public function findGameByAppId($appId)
    {
        return Steam::where('appId', $appId)->first();
    }
}
