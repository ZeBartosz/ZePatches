<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\SteamController;

class TestSteamController extends Command
{
    // The name and signature of the console command.
    protected $signature = 'steam:test';

    // The console command description.
    protected $description = 'Test SteamController functionality';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Instantiate your SteamController and call the test method
        $steamController = new SteamController();
        $steamController->test();

        return 0;
    }
}
