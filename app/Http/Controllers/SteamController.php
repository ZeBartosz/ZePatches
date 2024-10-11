<?php

namespace App\Http\Controllers;

use App\Models\Steam;
use Illuminate\Http\Request;
use Syntax\SteamApi\Facades\SteamApi;
use Inertia\Inertia;

class SteamController
{
    public function test()
    {
        // Get news
        $steam = '';
        // Return to Inertia 'Home' component with 'steam' as a prop
        return Inertia::render('Home', ['steam' => $steam]);
    }

    public function searchForGame(Request $request) {

        $games = Steam::findGameByName($request->search);
        
        return inertia('Home', ['games' => $games]);

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
