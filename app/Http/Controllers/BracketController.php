<?php

namespace App\Http\Controllers;

use App\Models\Bracket;
use Inertia\Inertia;
use Illuminate\Http\Request;

class BracketController extends Controller
{
    /**
     * Menampilkan halaman bracket untuk Mobile Legends.
     */
    public function indexML()
    {
        // Ambil semua data bracket yang aktif untuk ML, diurutkan berdasarkan position
        $brackets = Bracket::where('game_name', 'ML')
            ->where('is_active', true)
            ->orderBy('order_position', 'asc')
            ->get();

        return Inertia::render('bracketml', [
            'brackets' => $brackets
        ]);
    }

    /**
     * Menampilkan halaman bracket untuk Free Fire.
     */
    public function indexFF()
    {
        $brackets = Bracket::where('game_name', 'FF')
            ->where('is_active', true)
            ->orderBy('order_position', 'asc')
            ->get();

        return Inertia::render('bracketff', [
            'brackets' => $brackets
        ]);
    }

    /**
     * (Opsional) Method untuk menyimpan data baru dari Admin.
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
