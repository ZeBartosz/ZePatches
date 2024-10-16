<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SteamController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SteamController::class, 'index']);

Route::resource('auth', AuthController::class);

Route::inertia('/register', 'Auth/Register');
Route::inertia('/login', 'Auth/Login');

Route::get('/game/{steam}', [SteamController::class, 'show']);


Route::post('/inputGames', [SteamController::class, 'store']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/games/details/{steam}', [SteamController::class, 'fetchGameDetails']);
