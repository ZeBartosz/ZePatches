<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Syntax\SteamApi\Facades\SteamApi;

class Steam extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'appId',
        'developer',
        'releaseDate',
        'banner',
        'type',
        'moreDetails',
    ];

    public static function findGameByName(String $game)
    {
        return self::where('name', 'LIKE', "%$game%")->orderBy('type')->get();
    }

    public static function findGameByAppId($appId)
    {
        return self::where('appId', $appId)->first();
    }

    public static function getGameDetails($appId)
    {
        $num = +$appId;
        return SteamApi::app()->appDetails($num)->first();
    }
}
