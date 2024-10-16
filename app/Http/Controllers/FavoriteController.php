<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFavoriteRequest;
use App\Http\Requests\UpdateFavoriteRequest;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{


    public function favorite(Request $request)
    {
        //
    }

    public function unFavorite(Favorite $favorite)
    {
        //
    }
}
