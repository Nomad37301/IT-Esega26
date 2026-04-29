<?php

namespace App\Http\Controllers;

use App\Http\Requests\PUBGPlayerRequest;
use App\Http\Requests\StorePlayerMLRegistrationRequest;
use App\Models\PUBG_Team;
use App\Models\PUBG_Participant;
use App\Models\ML_Participant;
use App\Models\ML_Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PlayerRegistrationController extends Controller
{

    public function showRegistrationForm($encryptedTeamName)
    {
        try {
            $teamName = decrypt($encryptedTeamName);

            $team = ML_Team::where('team_name', $teamName)->firstOrFail();
            
            Log::info('Showing ML registration form', ['team_id' => $team->id, 'team_name' => $team->team_name]);

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            Log::error('Invalid encrypted team name', ['error' => $e->getMessage()]);
            abort(403, 'This URL is no longer valid or was tampered with.');
        }

        return Inertia::render('player-regis/player-registration-form', [
            'teamData' => $team,
            'gameType' => 'ml',
        ]);
    }


    public function store(StorePlayerMLRegistrationRequest $request)
    {
        $validated = $request->validated();
        
        Log::info('Processing ML team registration', [
            'team_id' => $validated['team_id'] ?? 'not provided',
            'player_count' => count($validated['ml_players'] ?? [])
        ]);

        if (!empty($validated['ml_players'])) {
            $teamId = $validated['team_id'];
            $team = ML_Team::findOrFail($teamId);
            $teamSlug = Str::slug($team->team_name);

            // Buat folder player jika belum ada
            $playerBasePath = "ML_teams/{$teamId}_{$teamSlug}/players";
            
            // Gunakan Storage facade untuk membuat direktori
            if (!Storage::disk('public')->exists($playerBasePath)) {
                Storage::disk('public')->makeDirectory($playerBasePath, 0777, true);
            }

            foreach ($validated['ml_players'] as $index => $player) {
                try {
                    $photoPath = null;
                    if ($request->hasFile("ml_players_{$index}_foto")) {
                        $file = $request->file("ml_players_{$index}_foto");
                        if ($file && $file->isValid()) {
                            $photoExtension = $file->getClientOriginalExtension();
                            $photoFileName = "player_{$index}_foto.{$photoExtension}";
                            $photoPath = $file->storeAs($playerBasePath, $photoFileName, 'public');
                        }
                    }

                    $signaturePath = null;
                    if ($request->hasFile("ml_players_{$index}_tanda_tangan")) {
                        $file = $request->file("ml_players_{$index}_tanda_tangan");
                        if ($file && $file->isValid()) {
                            $signatureExtension = $file->getClientOriginalExtension();
                            $signatureFileName = "player_{$index}_ttd.{$signatureExtension}";
                            $signaturePath = $file->storeAs($playerBasePath, $signatureFileName, 'public');
                        }
                    }

                    // Debug: Log file information
                    Log::info("Processing ML player {$index}", [
                        'has_foto' => $request->hasFile("ml_players_{$index}_foto"),
                        'has_tanda_tangan' => $request->hasFile("ml_players_{$index}_tanda_tangan"),
                        'foto_path' => $photoPath,
                        'tanda_tangan_path' => $signaturePath,
                        'player_data' => $player
                    ]);

                    $participant = ML_Participant::create([
                        'ml_team_id' => $teamId,
                        'name' => $player['name'],
                        'nickname' => $player['nickname'],
                        'id_server' => $player['id_server'],
                        'no_hp' => $player['no_hp'],
                        'email' => $player['email'],
                        'alamat' => $player['alamat'] ?? '-',
                        'tanda_tangan' => $signaturePath,
                        'foto' => $photoPath,
                        'role' => $player['role']
                    ]);
                    
                    Log::info("ML player saved", [
                        'player_id' => $participant->id,
                        'name' => $participant->name,
                        'team_id' => $teamId
                    ]);
                } catch (\Exception $e) {
                    Log::error("Error saving ML player {$index}", [
                        'error' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine()
                    ]);
                }
            }
        }

        // Cek apakah user menggunakan double slot dan ini adalah tim pertama
        if (Session::has('double_slot_registered')) {
            Session::forget('double_slot_registered'); // Hapus penanda karena sudah tidak dibutuhkan
            
            // Arahkan ke halaman registrasi tim kedua dengan pesan
            Session::flash('info', 'Pendaftaran Player berhasil di lakukan, tunggu konfirmasi dari Humas IT-ESEGA!.');
            return redirect()->route('home')->with([
                'showSecondTeamRegistration' => true, 
                'success' => 'Pendaftaran Player berhasil di lakukan, tunggu konfirmasi dari Humas IT-ESEGA!.'
            ]);
        }

        return to_route('home')->with('success', 'Pendaftaran Player berhasil di lakukan, tunggu konfirmasi dari Humas IT-ESSEGA!');
    }


    public function showRegistrationFormPUBG($encryptedTeamName)
    {
        try {
            $teamName = decrypt($encryptedTeamName);

            $team = PUBG_Team::where('team_name', $teamName)->firstOrFail();
            
            Log::info('Showing PUBG registration form', ['team_id' => $team->id, 'team_name' => $team->team_name]);

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            Log::error('Invalid encrypted PUBG team name', ['error' => $e->getMessage()]);
            abort(403, 'This URL is no longer valid or was tampered with.');
        }

        return Inertia::render('player-regis/pubg-player-registration-form', [
            'teamData' => $team,
            'gameType' => 'pubg',
        ]);
    }

    public function storePUBG(PUBGPlayerRequest $request)
    {
        $validated = $request->validated();
        
        Log::info('Processing PUBG team registration', [
            'team_id' => $validated['team_id'] ?? 'not provided',
            'player_count' => count($validated['pubg_players'] ?? [])
        ]);
        
        $teamId = $validated['team_id'];
        $team = PUBG_Team::findOrFail($teamId);
        $teamSlug = Str::slug($team->team_name);

        // Buat folder player jika belum ada
        $playerBasePath = "PUBG_teams/{$teamId}_{$teamSlug}/players";
        
        // Gunakan Storage facade untuk membuat direktori
        if (!Storage::disk('public')->exists($playerBasePath)) {
            Storage::disk('public')->makeDirectory($playerBasePath, 0777, true);
        }

        foreach ($validated['pubg_players'] as $index => $player) {
            try {
                $photoPath = null;
                if ($request->hasFile("pubg_players_{$index}_foto")) {
                    $file = $request->file("pubg_players_{$index}_foto");
                    if ($file && $file->isValid()) {
                        $photoExtension = $file->getClientOriginalExtension();
                        $photoFileName = "player_{$index}_foto.{$photoExtension}";
                        $photoPath = $file->storeAs($playerBasePath, $photoFileName, 'public');
                    }
                }

                $signaturePath = null;
                if ($request->hasFile("pubg_players_{$index}_tanda_tangan")) {
                    $file = $request->file("pubg_players_{$index}_tanda_tangan");
                    if ($file && $file->isValid()) {
                        $signatureExtension = $file->getClientOriginalExtension();
                        $signatureFileName = "player_{$index}_ttd.{$signatureExtension}";
                        $signaturePath = $file->storeAs($playerBasePath, $signatureFileName, 'public');
                    }
                }

                Log::info("Processing PUBG player {$index}", [
                    'has_foto' => $request->hasFile("pubg_players_{$index}_foto"),
                    'has_tanda_tangan' => $request->hasFile("pubg_players_{$index}_tanda_tangan"),
                    'foto_path' => $photoPath,
                    'tanda_tangan_path' => $signaturePath,
                    'player_data' => $player
                ]);

                $participant = PUBG_Participant::create([
                    'pubg_team_id' => $teamId,
                    'name' => $player['name'],
                    'nickname' => $player['nickname'],
                    'id_server' => $player['id_server'],
                    'no_hp' => $player['no_hp'],
                    'email' => $player['email'],
                    'alamat' => $player['alamat'] ?? '-',
                    'tanda_tangan' => $signaturePath,
                    'foto' => $photoPath,
                    'role' => $player['role']
                ]);
                
                Log::info("PUBG player saved", [
                    'player_id' => $participant->id,
                    'name' => $participant->name,
                    'team_id' => $teamId
                ]);
            } catch (\Exception $e) {
                Log::error("Error saving PUBG player {$index}", [
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ]);
            }
        }

        return to_route('home')->with('success', 'Pendaftaran Player berhasil di lakukan, tunggu konfirmasi dari Humas IT-ESSEGA!');
    }
}
