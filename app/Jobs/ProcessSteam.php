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

        ini_set('memory_limit', '1024M');

        // Get all appIds from Steam
        $steamApps = SteamApi::app()->GetAppList();
        log::info("the total count of games: " . count($steamApps));

        foreach ($steamApps as $game) {
            // Access properties using the object notation
            if (isset($game->appid, $game->name)) {
                // Use Create correctly
                Steam::updateOrCreate([
                    'appId' => $game->appid,
                    'name' => $game->name
                ])->searchable();
            }
            unset($game);
        }
    }
}
