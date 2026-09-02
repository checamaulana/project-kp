<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Purge soft-deleted surat older than 30 days (daily at 03:00)
Schedule::call(function () {
    app(\App\Services\SuratMasukService::class)->purgeOldTrashed();
})->dailyAt('03:00')->name('purge-old-surat');

// Cleanup notifications older than 90 days (weekly)
Schedule::call(function () {
    \DB::table('notifications')->where('created_at', '<', now()->subDays(90))->delete();
})->weekly()->name('cleanup-notifications');
