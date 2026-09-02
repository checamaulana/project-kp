<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AuditLog::with('user')->latest('created_at');

        if ($userId = $request->input('user_id')) {
            $query->where('user_id', $userId);
        }
        if ($modelType = $request->input('model_type')) {
            $query->where('model_type', $modelType);
        }
        if ($action = $request->input('action')) {
            $query->where('action', $action);
        }

        $logs = $query->paginate(50)->withQueryString();

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['user_id', 'model_type', 'action']),
        ]);
    }
}
