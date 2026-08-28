<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\SuratController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [
    DashboardController::class,
    'index',
])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Surat
|--------------------------------------------------------------------------
*/

Route::resource(
    'surat',
    SuratController::class
);

/*
|--------------------------------------------------------------------------
| Disposisi
|--------------------------------------------------------------------------
*/

Route::resource(
    'disposisi',
    DisposisiController::class
)->only([
    'index',
    'create',
    'store',
    'show',
    'update',
]);
