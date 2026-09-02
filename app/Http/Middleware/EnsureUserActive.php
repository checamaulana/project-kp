<?php

namespace App\Http\Middleware;

use App\Enums\StatusUserEnum;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->status !== StatusUserEnum::ACTIVE) {
            auth()->logout();

            abort(403, 'Akun Anda belum aktif atau telah dinonaktifkan.');
        }

        return $next($request);
    }
}
