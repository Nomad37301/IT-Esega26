<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FF_Participant;
use App\Models\ML_Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PlayerController extends Controller
{
    /**
     * Get all players for a specific game type
     */
    public function index($game)
    {
        try {
            Log::info('Fetching players for game: ' . $game);
            
            if ($game === 'ff') {
                $players = FF_Participant::with('team')->get();
                Log::info('FF Players found: ' . $players->count());
            } elseif ($game === 'ml') {
                $players = ML_Participant::with('team')->get();
                Log::info('ML Players found: ' . $players->count());
            } else {
                Log::error('Invalid game type: ' . $game);
                return response()->json(['error' => 'Invalid game type'], 400);
            }

            if ($players->isEmpty()) {
                Log::info('No players found for game: ' . $game);
                return response()->json([]);
            }

            $formattedPlayers = $players->map(function($player) {
                try {
                    return [
                        'id' => $player->id,
                        'name' => $player->name,
                        'nickname' => $player->nickname,
                        'role' => $player->role ?? 'anggota',
                        'id_server' => $player->id_server,
                        'no_hp' => $player->no_hp,
                        'email' => $player->email,
                        'alamat' => $player->alamat,
                        'tanda_tangan' => $player->tanda_tangan ? asset('storage/' . $player->tanda_tangan) : null,
                        'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                        'team_name' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                        'created_at' => $player->created_at,
                        'status' => $player->status ?? 'active'
                    ];
                } catch (\Exception $e) {
                    Log::error('Error formatting player data', [
                        'player_id' => $player->id,
                        'error' => $e->getMessage()
                    ]);
                    return null;
                }
            })->filter();

            Log::info('Successfully formatted players data');
            return response()->json($formattedPlayers);

        } catch (\Exception $e) {
            Log::error('Error in PlayerController@index', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'game' => $game
            ]);
            
            return response()->json([
                'error' => 'Failed to fetch players: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Filter players based on criteria
     */
    public function filter(Request $request, $game)
    {
        try {
            $search = $request->input('search');
            $role = $request->input('role');
            $team = $request->input('team');

            if ($game === 'ff') {
                $query = FF_Participant::query()->with('team');
            } elseif ($game === 'ml') {
                $query = ML_Participant::query()->with('team');
            } else {
                return response()->json(['error' => 'Invalid game type'], 400);
            }

            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nickname', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            if ($role) {
                $query->where('role', $role);
            }

            if ($team) {
                $query->whereHas('team', function($q) use ($team) {
                    $q->where('team_name', 'like', "%{$team}%");
                });
            }

            $players = $query->get();

            $formattedPlayers = $players->map(function($player) {
                return [
                    'id' => $player->id,
                    'name' => $player->name,
                    'nickname' => $player->nickname,
                    'role' => $player->role ?? 'anggota',
                    'id_server' => $player->id_server,
                    'no_hp' => $player->no_hp,
                    'email' => $player->email,
                    'alamat' => $player->alamat,
                    'tanda_tangan' => $player->tanda_tangan ? asset('storage/' . $player->tanda_tangan) : null,
                    'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                    'team_name' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                    'created_at' => $player->created_at,
                    'status' => 'active'
                ];
            });

            return response()->json($formattedPlayers);

        } catch (\Exception $e) {
            Log::error('Error filtering players: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to filter players'], 500);
        }
    }

    /**
     * Update player data
     */
    public function update(Request $request, $game, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'nickname' => 'required|string|max:255',
                'role' => 'required|string|in:ketua,anggota,cadangan',
                'id_server' => 'nullable|string|max:255',
                'no_hp' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'alamat' => 'nullable|string|max:255',
            ]);

            if ($game === 'ff') {
                $player = FF_Participant::findOrFail($id);
            } elseif ($game === 'ml') {
                $player = ML_Participant::findOrFail($id);
            } else {
                return response()->json(['error' => 'Invalid game type'], 400);
            }

            $player->update($validatedData);

            return response()->json([
                'success' => true,
                'message' => 'Player updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating player: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update player'], 500);
        }
    }

    /**
     * Delete player
     */
    public function destroy($game, $id)
    {
        try {
            if ($game === 'ff') {
                $player = FF_Participant::findOrFail($id);
            } elseif ($game === 'ml') {
                $player = ML_Participant::findOrFail($id);
            } else {
                return response()->json(['error' => 'Invalid game type'], 400);
            }

            if ($player->foto && Storage::disk('public')->exists($player->foto)) {
                Storage::disk('public')->delete($player->foto);
            }
            
            if ($player->tanda_tangan && Storage::disk('public')->exists($player->tanda_tangan)) {
                Storage::disk('public')->delete($player->tanda_tangan);
            }

            $player->delete();

            return response()->json([
                'success' => true,
                'message' => 'Player deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting player: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete player'], 500);
        }
    }
} 