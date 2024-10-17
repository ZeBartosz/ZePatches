<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
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

    public function favorites(): HasMany
    {
        return $this->hasMany(Steam::class);
    }
}
