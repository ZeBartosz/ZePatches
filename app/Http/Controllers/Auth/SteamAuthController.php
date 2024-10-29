<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SteamAuthController extends Controller
{

    public function redirectToSteam()
    {
        return Socialite::driver('steam')->redirect();
    }

    public function handleSteamCallback()
    {

        try {
            $steamUser = Socialite::driver('steam')->user();
            $user = User::firstOrCreate(
                ['steam_id' => $steamUser->id],
                [
                    'nickname' => $steamUser->nickname,
                    'avatar' => $steamUser->avatar,
                ]
            );
            Auth::login($user, true);

            $token = $user->createToken('access_token')->plainTextToken;

            return redirect()->away("http://localhost:3000/auth/callback?token=$token");
        } catch (\Exception $e) {
            return redirect("/")->withErrors('Steam login failed.');
        }
    }

    public function logout(Request $request)
    {

        // Logout the user
        Auth::logout();

        // Invalidate the session
        $request->session()->invalidate();

        // Regenerate the token 
        $request->session()->regenerateToken();

        // Redirect to home 
        return redirect('/');
    }
}
