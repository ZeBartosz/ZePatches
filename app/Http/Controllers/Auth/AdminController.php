<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAdminRequest;
use App\Http\Requests\UpdateAdminRequest;
use App\Jobs\ProcessSteam;
use App\Models\Admin;
use App\Models\Steam;
use App\Models\User;
use Syntax\SteamApi\Facades\SteamApi;

class AdminController extends Controller
{

    public function show()
    {
        $totalGameCount = Steam::count();
        $topFavorites = Steam::withCount(['favorites'])
            ->whereHas('favorites')
            ->orderByDesc('favorites_count')
            ->limit(10)->get();
        $users = User::withCount(['favorites'])->get();


        return inertia('Auth/AdminDashboard',
            ['gameCount' => $totalGameCount, 'users' => $users, 'topFavorite' => $topFavorites]);
    }

    public function FetchGamesFromAPI()
    {
        collect(SteamApi::app()->GetAppList())
            ->chunk(1000)->each(function ($games) {
                ProcessSteam::dispatch($games);
            });

        return back()->with('message', 'Retriving games from API ');
    }

    public function promoteUserToAdmin($userId)
    {
        $user = User::where('id', $userId)->first();

        $user->update([
            'is_admin' => true,
        ]);

        return back()->with('message', $user->nickname.' has Promoted to admin');
    }

    public function demoteUserToAdmin($userId)
    {
        $user = User::where('id', $userId)->first();

        $user->update([
            'is_admin' => false,
        ]);

        return back()->with('message', $user->nickname.' has Demoted from being a admin');
    }
}
