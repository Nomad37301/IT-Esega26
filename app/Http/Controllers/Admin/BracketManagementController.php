<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bracket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BracketManagementController extends Controller
{
    /**
     * Display a listing of the brackets for the admin.
     */
    public function index()
    {
        return Inertia::render('admin/brackets/index', [
            'brackets' => Bracket::orderBy('game_name')
                ->orderBy('order_position')
                ->get()
        ]);
    }

    /**
     * Store a newly created bracket in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_name' => 'required|string|max:255',
            'stage_name' => 'required|string|max:255',
            'group_name' => 'nullable|string|max:255',
            'bracket_url' => 'required|url',
            'order_position' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        // Generate a unique slug
        $slugBase = Str::slug($validated['game_name'] . '-' . $validated['stage_name'] . '-' . ($validated['group_name'] ?? 'final'));
        $validated['slug'] = $slugBase . '-' . rand(100, 999);

        Bracket::create($validated);

        return back()->with('success', 'Bracket created successfully.');
    }

    /**
     * Update the specified bracket in storage.
     */
    public function update(Request $request, Bracket $bracket)
    {
        $validated = $request->validate([
            'game_name' => 'required|string|max:255',
            'stage_name' => 'required|string|max:255',
            'group_name' => 'nullable|string|max:255',
            'bracket_url' => 'required|url',
            'order_position' => 'required|integer',
            'is_active' => 'required|boolean',
        ]);

        $bracket->update($validated);

        return back()->with('success', 'Bracket updated successfully.');
    }

    /**
     * Remove the specified bracket from storage.
     */
    public function destroy(Bracket $bracket)
    {
        $bracket->delete();

        return back()->with('success', 'Bracket deleted successfully.');
    }
}
