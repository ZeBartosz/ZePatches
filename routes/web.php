<?php

use App\Http\Controllers\SteamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [SteamController::class, 'index']);
Route::inertia('/register', '../Auth/Register');

Route::get('/register', function() {
    return Inertia::render('Auth/Register');
});
Route::get('/game/{steam}' , [SteamController::class, 'show']);


Route::post('/inputGames', [SteamController::class, 'store']);