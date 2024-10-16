<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;
use Syntax\SteamApi\Facades\SteamApi;

class Steam extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Searchable;

    protected $fillable = [
        'name',
        'appId',
        'developer',
        'releaseDate',
        'banner',
        'type',
        'moreDetails',
    ];

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
        ];
    }

    public static function findGameByName(String $game)
    {
        return self::search($game)->query(function ($query) {
            $query->orderByRaw("
            CASE 
                WHEN type = 'game' THEN 0
                WHEN type = 'dlc' THEN 1
                WHEN type = 'Unknown Type' THEN 3
                ELSE 2
            END
                ")->orderByRaw('LENGTH(name) ASC');
        });
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
