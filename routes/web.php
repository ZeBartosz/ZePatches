<?php

use App\Http\Controllers\Auth\AdminController;
use App\Http\Controllers\Auth\SteamAuthController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\SteamController;
use App\Models\Favorite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SteamController::class, 'index']);

Route::get('/game/{steam}', [SteamController::class, 'show']);

Route::get('/favorites/{user}/{steam}', [FavoriteController::class, 'isFavorited']);

Route::post('/games/batchDetails', [SteamController::class, 'fetchGameDetails']);
Route::post('/favorite/{steam}', [FavoriteController::class, 'favorite']);
Route::post('/inputGames', [SteamController::class, 'store']);

Route::get('/admin/dashboard', [AdminController::class, 'show']);
Route::post('/fetchGames', [AdminController::class, 'FetchGamesFromAPI']);


Route::post('/logout', [SteamAuthController::class, 'logout']);
Route::get('/auth/steam', [SteamAuthController::class, 'redirectToSteam']);
Route::get('/auth/steam/callback', [SteamAuthController::class, 'handleSteamCallback']);
