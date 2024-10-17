<?php

namespace App\Services;

use App\Models\Steam;
use Syntax\SteamApi\Facades\SteamApi;

class SteamService
{


    public function getSearchedGames(String $search)
    {
        // Checks if $search is set
        if (!$search) {
            return [];
        }

        // Retrieves limited games matching the search query paginate by 10
        return $this->findGameByName($search)->paginate(10);
    }

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

    public function findGameByAppId($appId)
    {
        return Steam::where('appId', $appId)->first();
    }

    public function getGameDetails($appId)
    {
        $num = +$appId;
        return SteamApi::app()->appDetails($num)->first();
    }
}
