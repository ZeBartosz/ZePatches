<?php

namespace App\Http\Controllers;

use Syntax\SteamApi\Facades\SteamApi;

class SteamController
{
    public function test()
    {
        // Get Portal 2 details
        $apps = SteamApi::app()->appDetails(10);
        echo $apps->first()->name;
    }
}
