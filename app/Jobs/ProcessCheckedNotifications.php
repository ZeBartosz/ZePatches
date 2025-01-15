<?php

namespace App\Jobs;

use App\Models\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessCheckedNotifications implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Notification::where('checked', true)
            ->chunk(1000, function ($notifications) {
                foreach ($notifications as $notification) {
                    $notification->delete();
                }
            });
    }
}
