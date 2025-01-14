<?php

namespace App\Jobs;

use App\Models\Steam;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessSteam implements ShouldQueue
{

    use Queueable;

    public $games;

    public function __construct($games)
    {
        $this->games = $games;
    }

    public function handle(): void
    {
        foreach ($this->games as $game) {
            if (isset($game->appid, $game->name)) {
                if (!Steam::where('appid', $game->appid)->exists()) {
                    Steam::create([
                        'appId' => $game->appid,
                        'name' => $game->name
                    ])->searchable();
                }
            }
        }
    }
}
