<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuratController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\DashboardController;

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/dashboard',
        [DashboardController::class, 'index']
    );


    /*
    |--------------------------------------------------------------------------
    | SURAT
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/surat',
        [SuratController::class, 'index']
    );

    Route::post(
        '/surat',
        [SuratController::class, 'store']
    );

    Route::get(
        '/surat/{surat}',
        [SuratController::class, 'show']
    );

    Route::post(
        '/surat/{surat}',
        [SuratController::class, 'update']
    );

    Route::delete(
        '/surat/{surat}',
        [SuratController::class, 'destroy']
    );


    /*
    |--------------------------------------------------------------------------
    | DISPOSISI
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/disposisi',
        [DisposisiController::class, 'index']
    );

    Route::post(
        '/disposisi',
        [DisposisiController::class, 'store']
    );

    Route::get(
        '/disposisi/{disposisi}',
        [DisposisiController::class, 'show']
    );

    Route::put(
        '/disposisi/{disposisi}',
        [DisposisiController::class, 'update']
    );


    /*
    |--------------------------------------------------------------------------
    | UNIT
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/units',
        [UnitController::class, 'index']
    );

});