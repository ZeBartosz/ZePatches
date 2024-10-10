<?php

use App\Http\Controllers\SteamController;
use Illuminate\Support\Facades\Route;


Route::get('/', [SteamController::class, 'test']);


Route::post('/search', [SteamController::class, 'searchForGame']);
Route::post('/inputGames', [SteamController::class, 'store']);