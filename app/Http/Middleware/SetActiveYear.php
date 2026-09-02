<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetActiveYear
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->session()->has('active_year')) {
            $request->session()->put('active_year', now()->year);
        }

        return $next($request);
    }
}
