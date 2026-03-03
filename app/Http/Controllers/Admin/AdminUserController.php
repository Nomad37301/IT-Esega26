<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserSharedResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    public function index()
    {
        $admin = User::role(['admin', 'super_admin'])->get();
        return Inertia::render('admin/admin', [
            'admin' => UserSharedResource::collection($admin)
        ]);
    }

    public function store(UserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $data['email_verified_at'] = now();

        $data['remember_token'] = Str::random(10);

        $user = User::create($data);

        $allowedRoles = Role::pluck('name')->toArray();
        if ($request->filled('role') && in_array($request->input('role'), $allowedRoles)) {
            $user->assignRole($request->input('role'));
        }

        Session::flash('success', "New Admin Successfully Added!");
        return redirect()->back();
    }


    public function update(UserRequest $request, User $user)
    {
        $data = $request->validated();
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->input('password'));
        } else {
            unset($data['password']);
        }

        $user->update($data);

        if ($request->filled('role')) {
            $user->syncRoles([$request->input('role')]);
        }

        Session::flash('success', "Admin updated successfully.");
        return redirect()->back();
    }

    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        Session::flash('success', "Admin deleted successfully.");
        return redirect()->back();
    }
}
