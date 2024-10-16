<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{

    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function steams(): BelongsTo
    {
        return $this->belongsTo(Steam::class);
    }
}
