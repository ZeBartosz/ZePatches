<?php

use App\Jobs\ProcessNotification;
use Illuminate\Support\Facades\Schedule;

//Artisan::command('inspire', function () {
//    $this->comment(Inspiring::quote());
//})->purpose('Display an inspiring quote')->hourly();

Schedule::call(new ProcessNotification())->hourly();
