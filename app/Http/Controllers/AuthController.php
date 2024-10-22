<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController
{

    public function register(Request $request)
    {

        // validating the data
        $request->validate([
            'username' => 'required | max:32',
            'email' => 'required | max:255 | email',
            'password' => 'required | min:3 | confirmed',
        ]);

        // Register the user
        $user = User::create([
            'name' => $request->username,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        // Login
        Auth::login($user);

        // Redirect back to home page
        return redirect('/');
    }

    public function login(Request $request)
    {
        // validate the imput
        $data = $request->validate([
            'email' => 'required | max:255 | email',
            'password' => 'required',
        ]);

        // Checks if useer doesnt exites 
        if (!Auth::attempt($data)) {
            return back()->withErrors(['failed' => 'The provided information does not match our records']);
        }

        // Redirect to home page
        return redirect()->intended();
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
