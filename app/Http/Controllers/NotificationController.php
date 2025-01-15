<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class NotificationController extends Controller
{
    public function updateChecked(Request $request)
    {
        $validated = $request->validate([
            'notificationId' => 'required|array',
        ]);

        Notification::whereIn('id', $validated['notificationId'])->update(['checked' => true]);

    }

    public function deleteNotifications()
    {
        Auth::user()->notifications()->delete();

        return back()->with('message', 'Notifications have been deleted');
    }

}
