<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Http\Controllers\Controller;
use App\Models\Steam;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{


    public function favorite(Steam $steam)
    {

        $user = Auth::user();
        $favorite = $steam->favorites()
            ->where('user_id', $user->id)
            ->first();

        if (!$favorite) {
            $steam->favorites()->create([
                'user_id' => $user->id,
            ]);
            return back()->with('Added', 'The ' . $steam->name . ' was added to your favorite list');
        } else {
            $favorite->delete();
            return back()->with('success', 'The ' . $steam->name . ' was removed from your favorite list');
        }
    }


    public function isFavorited(User $user)
    {
        $isFavorited = Favorite::where('user_id', $user->id)
            ->exists();

        return response()->json(['favorited' => $isFavorited]);
    }
}
