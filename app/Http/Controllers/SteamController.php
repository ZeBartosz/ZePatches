<?php

namespace App\Http\Controllers;

use App\Models\Steam;
use Illuminate\Http\Request;
use Syntax\SteamApi\Facades\SteamApi;
use Inertia\Inertia;

class SteamController
{


    public function index () {

        // Gets details from search query
        $search = request()->get('search', ""); 
        $games = '';
        
        // Checks if $search is set
        if ($search) {
            // Checks for games with similar name then puts it in $game
            $games = Steam::findGameByName($search);
        } 
        
        // return home with games and search string
        return inertia('Home', ['games' => $games, 'search' => $search]);
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
                Steam::updateOrCreate([
                    'appId' => $game->appid, 
                    'name' => $game->name    
                ]);
            }
        }

        // Resets the max execution time back to 60sec  
        ini_set('max_execution_time', 60);
    }

}
