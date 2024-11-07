<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
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
            return Auth::user()->notifications;
        });

        Event::listen(function (SocialiteWasCalled $event) {
            $event->extendSocialite('steam', Provider::class);
        });
    }
}
