<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;


class NotificationController extends Controller
{
    public function updateChecked(Request $request)
    {
        $validated = $request->validate([
            'notificationId' => 'required|array',
        ]);

        Notification::whereIn('id', $validated['notificationId'])->update(['checked' => true]);

    }

}
