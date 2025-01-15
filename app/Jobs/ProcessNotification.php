<?php

namespace App\Jobs;

use App\Events\BroadCastNotification;
use App\Models\Favorite;
use App\Models\Notification;
use App\Models\Steam;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ProcessNotification implements ShouldQueue
{

    use Queueable;

    public function __construct()
    {
        //
    }

    public function handle(): void
    {

        $favorite = Favorite::get()->pluck('steam_id');
        $games = Steam::whereIn('id', $favorite)->get();

        foreach ($games as $game) {
            // Fetch data from URLs
            $eventPatches = $this->fetchData($game->appId, 13);
            $patches = $this->fetchData($game->appId, 12);

            // Process events and patches
            $this->processUpdates($game, $eventPatches, 'event');
            $this->processUpdates($game, $patches, 'patch');
        }
    }

    private function fetchData(int $appId, int $eventTypeFilter): array
    {
        $url = "https://store.steampowered.com/events/ajaxgetadjacentpartnerevents/?appid={$appId}&count_before=0&count_after=100&event_type_filter={$eventTypeFilter}";
        return Http::get($url)->json();
    }

    private function processUpdates(Steam $game, array $data, string $type): void
    {
        if (empty($data['events'])) {
            return;
        }


        // Extract the necessary fields
        $latestDate = Carbon::createFromTimestamp($data['events'][0]['announcement_body']['posttime'])->toDateTimeString();
        $currentDate = $type === 'event' ? $game->eventPatchesDate : $game->patchNotesDate;

        if ($latestDate === $currentDate) {
            return;
        }

        $name = $data['events'][0]['announcement_body']['headline'];
        $columnToUpdate = $type === 'event' ? 'eventPatchesDate' : 'patchNotesDate';
        $nameField = $type === 'event' ? 'eventName' : 'patchName';
        $dateField = $type === 'event' ? 'eventPatchesDate' : 'patchNotesDate';

        // Notify users and update the database
        $this->notifyUsers($game, $name, $latestDate, $nameField, $dateField);
        $game->update([$columnToUpdate => $latestDate]);
    }

    private function notifyUsers(
        Steam $game,
        string $name,
        string $latestDate,
        string $nameField,
        string $dateField
    ): void {
        $userIds = Favorite::where('steam_id', $game->id)->pluck('user_id');

        foreach ($userIds as $userId) {
            Cache::forget("user.{$userId}.notifications");

            $type = $nameField === 'eventName' ? 'Event' : 'Patch';
            $message = "{$game->name} has a new {$type}: {$name}";

            broadcast(new BroadCastNotification(User::find($userId), $message));

            Notification::create([
                'user_id' => $userId,
                'steam_id' => $game->id,
                $nameField => $name,
                $dateField => $latestDate,
                'game' => $game->name,
                'appId' => $game->appId,
            ]);
        }
    }

}
