<?php

namespace App\Services;

use App\Models\Steam;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Syntax\SteamApi\Facades\SteamApi;

class SteamService
{

    //
    public function getSearchedGames(string $search)
    {
        // Checks if $search is set
        if (!$search) {
            // Gets the users favorite games
            return $this->findFavoriteGame();
        }

        // Retrieves limited games matching the search query paginate by 10
        return $this->findGameByName($search)->paginate(8);
    }

    //

    public function findFavoriteGame()
    {

        // Check if user is logged in
        if (!Auth::user()) {
            return [];
        }

        // Search for the games with the ids
        $favorites = Auth::user()
            ->favorites()
            ->join('steams', 'favorites.steam_id', '=', 'steams.id')
            ->with('steam')
            ->orderBy('steams.name')
            ->paginate(10);


        // Search for the games with the ids
        $eventByLatest = Auth::user()
            ->favorites()
            ->join('steams', 'favorites.steam_id', '=', 'steams.id')
            ->with('steam')
            ->orderByRaw("
            CASE
                WHEN eventPatchesDate IS NULL THEN 1
                ELSE 0
            END ASC,
                eventPatchesDate DESC
            ")
            ->paginate(10);


        $patchesByLatest = Auth::user()
            ->favorites()
            ->join('steams', 'favorites.steam_id', '=', 'steams.id')
            ->with('steam')
            ->orderByRaw("
                CASE
                    WHEN patchNotesDate IS NULL THEN 1
                    ELSE 0
                END ASC,
                    patchNotesDate DESC
            ")
            ->paginate(10);

        return [
            'games' => $favorites,
            'eventOrder' => $eventByLatest,
            'patchesOrder' => $patchesByLatest
        ];
    }

    //

    public function findGameByName(string $game)
    {

        return Steam::search($game)
            ->query(function ($query) {
                $query->orderByRaw("
            CASE
                WHEN type = 'game' THEN 0
                WHEN type = 'dlc' THEN 1
                WHEN type = 'Unknown Type' THEN 3
                ELSE 2
            END
        ")->orderByRaw('LENGTH(name) ASC');

                // Check if a user is authenticated
                if (Auth::check()) {
                    $userId = Auth::id();
                    $query->addSelect('steams.*')
                        ->addSelect(DB::raw("EXISTS (
                            SELECT 1 FROM favorites
                            WHERE favorites.steam_id = steams.id
                            AND favorites.user_id = {$userId}
                        ) AS is_favorite"));
                }
            });
    }

    //

    public function getGameDetails($game)
    {
        $id = +$game->appId;
        $gameDetails = SteamApi::app()->appDetails($id)->first();

        $game->update([
            'type' => !empty($gameDetails->type) ? $gameDetails->type : "Unknown Type",
            'banner' => !empty($gameDetails->header) ? $gameDetails->header : "",
            'developer' => !empty($gameDetails->developers) ? $gameDetails->developers[0] : "Unknown Developer",
            'releaseDate' => $gameDetails->release->date ?? "Unknown Release Date",
            'moreDetails' => 1,
        ]);
    }

    // Find users favorited games

    public function getPatches($appId)
    {

        $gameName = $this->findGameByAppId($appId)->name;

        $urlMinor = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=".$appId."&count_before=0&count_after=100&event_type_filter=12";
        $urlMajor = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid=".$appId."&count_before=0&count_after=100&event_type_filter=13";

        $minorPatches = json_decode(file_get_contents($urlMinor), true);
        $majorPatches = json_decode(file_get_contents($urlMajor), true);

        return [
            'majorPatches' => $majorPatches,
            'minorPatches' => $minorPatches,
            'gameName' => $gameName
        ];
    }

    //

    public function findGameByAppId($appId)
    {
        return Steam::where('appId', $appId)->first();
    }
}
