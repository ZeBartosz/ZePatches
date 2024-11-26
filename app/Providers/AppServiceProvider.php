<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Inertia\Inertia;
use SocialiteProviders\Manager\SocialiteWasCalled;
use SocialiteProviders\Steam\Provider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $loader = \Illuminate\Foundation\AliasLoader::getInstance();
        $loader->alias('Debugbar', \Barryvdh\Debugbar\Facades\Debugbar::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('authUser', function () {
            return Auth::user();
        });

        Inertia::share('notifications', function () {
            if (!Auth::user()) {
                return [];
            }

            $cacheKey = 'user.' . Auth::id() . '.notifications';
            return Cache::remember($cacheKey, 5, function () {
                return Auth::user()->notifications()
                    ->orderBy(DB::raw('GREATEST(COALESCE(patchNotesDate, "1970-01-01 00:00:00"), COALESCE(eventPatchesDate, "1970-01-01 00:00:00"))'), 'DESC')
                    ->get();
            });
        });

        Event::listen(function (SocialiteWasCalled $event) {
            $event->extendSocialite('steam', Provider::class);
        });
    }
}
