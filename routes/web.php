<?php

use App\Http\Controllers\SteamController;
use Illuminate\Support\Facades\Route;


Route::get('/', [SteamController::class, 'index']);
Route::get('/game/{steam}' , [SteamController::class, 'show']);

Route::post('/inputGames', [SteamController::class, 'store']);