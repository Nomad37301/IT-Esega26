<?php

namespace App\Http\Controllers;

use App\Models\Bracket;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BracketController extends Controller
{
    /**
     * Displaying the bracket page for Mobile Legends Day 1
     */
    public function indexML()
    {
        $brackets = Bracket::where('game_name', 'ML')
            ->where('stage_name', 'LIKE', '%Day 1%')
            ->where('is_active', true)
            ->orderBy('order_position', 'asc')
            ->get();

        return Inertia::render('bracketml', [
            'brackets' => $brackets
        ]);
    }

    /**
     * Displaying the bracket page for Mobile Legends Day 2 & Grand Final.
     */
    public function indexML2()
    {
        $brackets = Bracket::where('game_name', 'ML')
            ->where('stage_name', 'NOT LIKE', '%Day 1%')
            ->where('is_active', true)
            ->orderBy('order_position', 'asc')
            ->get();

        return Inertia::render('bracketml2', [
            'brackets' => $brackets
        ]);
    }

    /**
     * Displaying the bracket page for PUBG Mobile Group Stage.
     */
    public function indexPUBG()
    {
        $brackets = Bracket::where('game_name', 'PUBG')
            ->where('stage_name', 'NOT LIKE', '%Final%')
            ->where('is_active', true)
            ->orderBy('order_position', 'asc')
            ->get();

        return Inertia::render('bracketpubg', [
            'brackets' => $brackets
        ]);
    }

    /**
     * Displaying the bracket page for PUBG Mobile Grand Final.
     */
    public function indexPUBG2()
    {
        $brackets = Bracket::where('game_name', 'PUBG')
            ->where('stage_name', 'LIKE', '%Final%')
            ->where('is_active', true)
            ->orderBy('order_position', 'asc')
            ->get();

        return Inertia::render('bracketpubg2', [
            'brackets' => $brackets
        ]);
    }

    /**
     * (Optional) Method for saving new data from the Admin.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_name' => 'required|string',
            'stage_name' => 'required|string',
            'bracket_url' => 'required|url',
            'slug' => 'required|unique:brackets,slug',
        ]);

        Bracket::create($validated);

        return back()->with('success', 'Bracket berhasil ditambahkan!');
    }
}
