<?php

namespace App\Jobs;

use App\Models\Steam;
use App\Services\SteamService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Syntax\SteamApi\Facades\SteamApi;

class NotificationProcess implements ShouldQueue
{

    use Queueable;

    public $games;

    public function __construct($games)
    {
        $this->games = $games;
    }

    public function handle(): void {}
}
