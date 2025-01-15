<?php

use App\Jobs\ProcessCheckedNotifications;
use App\Jobs\ProcessNotification;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new ProcessNotification())->hourly();
schedule::job(new ProcessCheckedNotifications())->hourlyAt(30);
