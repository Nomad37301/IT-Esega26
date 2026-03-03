<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserSharedResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Traits\HasRoles;

class AdminController extends Controller
{
    public function index()
    {

        $user = Auth::user();

        // dd($user);
        return Inertia::render('admin/dashboard', [
            'user' => new UserSharedResource($user),
        ]);
    }
}
