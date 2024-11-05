<?php

namespace Database\Factories;

use App\Models\Steam;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SteamFactory extends Factory
{
    protected $model = Steam::class;

    public function definition()
    {
        return [
            'appId' => $this->faker->unique()->randomNumber(7),  // Random 7-digit number for app ID
            'name' => $this->faker->words(3, true),               // Random name for the game
            'eventPatchesDate' => Carbon::now()->subDays(rand(1, 30)), // Random date in the last 30 days
            'patchNotesDate' => Carbon::now()->subDays(rand(1, 30)),   // Random date in the last 30 days
        ];
    }
}
