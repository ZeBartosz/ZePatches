<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

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
            $user = User::updateOrCreate(
                ['steam_id' => $steamUser->id],
                [
                    'nickname' => $steamUser->nickname,
                    'avatar' => $steamUser->avatar,
                ]
            );
            Auth::login($user, true);

            $token = $user->createToken('access_token')->plainTextToken;

            return redirect()->away(env("APP_URL")."?token=$token");
        } catch (Exception $e) {
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
