<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Favorite extends Model
{

    use HasFactory;

    protected $fillable = [
        'user_id',
        'steam_id',
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function steam(): BelongsTo
    {
        return $this->belongsTo(Steam::class);
    }
}
