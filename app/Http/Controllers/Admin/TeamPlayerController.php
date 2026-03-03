<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\FFTeamResource;
use App\Models\FF_Participant;
use App\Models\ML_Participant;
use App\Models\FF_Team;
use App\Models\ML_Team;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\FFPlayersExport;
use App\Exports\MLPlayersExport;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TeamPlayerController extends Controller
{
    public function index()
    {

        $ffTeams = FF_Team::withCount('participants')->get();
        $mlTeams = ML_Team::withCount('participants')->get();

        // Ubah kedua hasil mapping menjadi array biasa terlebih dahulu
        $ffTeamsArray = $ffTeams->map(function ($team) {
            return [
                'id' => $team->id,
                'name' => $team->team_name,
                'game' => 'Free Fire',
                'playerCount' => $team->participants_count,
                'achievements' => $team->achievements ?? 0,
                'logo' => $team->team_logo ? asset('storage/' . $team->team_logo) : '/placeholder.svg',
                'color' => 'from-orange-500 to-red-600',
                'status' => $team->status,
                'slot_type' => 'Single',
                'created_at' => $team->created_at->format('d M Y'),
            ];
        })->all(); // Konversi ke array

        $mlTeamsArray = $mlTeams->map(function ($team) {
            return [
                'id' => $team->id,
                'name' => $team->team_name,
                'game' => 'Mobile Legends',
                'playerCount' => $team->participants_count,
                'achievements' => $team->achievements ?? 0,
                'logo' => $team->team_logo ? asset('storage/' . $team->team_logo) : '/placeholder.svg',
                'color' => 'from-blue-500 to-purple-600',
                'status' => $team->status,
                'slot_type' => $team->slot_type ?? 'Standar',
                'created_at' => $team->created_at->format('d M Y'),
            ];
        })->all(); // Konversi ke array

        // Gabungkan dengan array_merge dan hasilnya jadikan collection lagi
        $combinedTeams = collect(array_merge($ffTeamsArray, $mlTeamsArray));
    
        return Inertia::render('admin/lomba/index', [
            'teams' => $combinedTeams,
            'totalTeams' => $combinedTeams->count(),
            'totalPlayers' => $combinedTeams->sum('playerCount'),
            'achievementsTotal' => $combinedTeams->sum('achievements'),
            'winRate' => 68,
        ]);
    }

    /**
     * Menampilkan detail tim berdasarkan ID dan jenis game
     */
    public function showTeam($id, $game)
    {
        if ($game === 'ff') {
            $team = FF_Team::with('participants')->findOrFail($id);
            
            $teamData = [
                'id' => $team->id,
                'name' => $team->team_name,
                'game' => 'Free Fire',
                'logo' => $team->team_logo ? asset('storage/' . $team->team_logo) : '/placeholder.svg',
                'payment_proof' => $team->proof_of_payment ? asset('storage/' . $team->proof_of_payment) : null,
                'status' => $team->status,
                'slot_type' => 'Single',
                'created_at' => $team->created_at->format('d M Y'),
                'players' => $team->participants->map(function($player) {
                    return [
                        'id' => $player->id,
                        'name' => $player->name,
                        'nickname' => $player->nickname,
                        'id_server' => $player->id_server,
                        'no_hp' => $player->no_hp,
                        'email' => $player->email,
                        'alamat' => $player->alamat,
                        'role' => $player->role,
                        'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                        'tanda_tangan' => $player->tanda_tangan ? asset('storage/' . $player->tanda_tangan) : null,
                    ];
                })
            ];
            
        } elseif ($game === 'ml') {
            $team = ML_Team::with('participants')->findOrFail($id);
            
            $teamData = [
                'id' => $team->id,
                'name' => $team->team_name,
                'game' => 'Mobile Legends',
                'logo' => $team->team_logo ? asset('storage/' . $team->team_logo) : '/placeholder.svg',
                'payment_proof' => $team->proof_of_payment ? asset('storage/' . $team->proof_of_payment) : null,
                'status' => $team->status,
                'slot_type' => $team->slot_type,
                'slot_count' => $team->slot_count,
                'created_at' => $team->created_at->format('d M Y'),
                'players' => $team->participants->map(function($player) {
                    return [
                        'id' => $player->id,
                        'name' => $player->name,
                        'nickname' => $player->nickname,
                        'id_server' => $player->id_server,
                        'no_hp' => $player->no_hp,
                        'email' => $player->email,
                        'alamat' => $player->alamat,
                        'role' => $player->role,
                        'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                        'tanda_tangan' => $player->tanda_tangan ? asset('storage/' . $player->tanda_tangan) : null,
                    ];
                })
            ];
        } else {
            return abort(404, 'Jenis game tidak valid');
        }
        
        return Inertia::render('admin/lomba/team-detail', [
            'team' => $teamData
        ]);
    }
    
    /**
     * Update status tim
     */
    public function updateTeamStatus(Request $request, $id, $game)
    {
        $request->validate([
            'status' => 'required|in:pending,verified,rejected'
        ]);
        
        if ($game === 'ff') {
            $team = FF_Team::findOrFail($id);
        } elseif ($game === 'ml') {
            $team = ML_Team::findOrFail($id);
        } else {
            return response()->json(['error' => 'Jenis game tidak valid'], 400);
        }
        
        $team->status = $request->status;
        $team->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Status tim berhasil diperbarui'
        ]);
    }

    public function ffPlayer(){
        $players = FF_Participant::with('team')->get();
        
        $formattedPlayers = $players->map(function($player) {
            return [
                'ID' => $player->id,
                'Nama' => $player->name,
                'Nickname' => $player->nickname,
                'ID Server' => $player->id_server,
                'No HP' => $player->no_hp,
                'Email' => $player->email,
                'Alamat' => $player->alamat,
                'Role' => $player->role ?? 'Anggota',
                'Tim' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                'Status' => 'Aktif',
                'Tanggal Daftar' => $player->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $player->updated_at->format('d M Y')
            ];
        });
        
        return Excel::download(new FFPlayersExport($formattedPlayers), 'ff_players.xlsx');
    }
    
    public function mlPlayer(){
        $players = ML_Participant::with('team')->get();
        
        $formattedPlayers = $players->map(function($player) {
            return [
                'ID' => $player->id,
                'Nama' => $player->name,
                'Nickname' => $player->nickname,
                'ID Server' => $player->id_server,
                'No HP' => $player->no_hp,
                'Email' => $player->email,
                'Alamat' => $player->alamat,
                'Role' => $player->role ?? 'Anggota',
                'Tim' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                'Status' => 'Aktif',
                'Tanggal Daftar' => $player->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $player->updated_at->format('d M Y')
            ];
        });
        
        return Excel::download(new MLPlayersExport($formattedPlayers), 'ml_players.xlsx');
    }
    
    /**
     * Export data tim ke Excel
     */
    public function exportTeams()
    {
        $ffTeams = FF_Team::withCount('participants')->get();
        $mlTeams = ML_Team::withCount('participants')->get();
        
        $ffTeamsArray = $ffTeams->map(function ($team) {
            return [
                'ID' => $team->id,
                'Nama Tim' => $team->team_name,
                'Game' => 'Free Fire',
                'Jenis Slot' => 'Single',
                'Jumlah Pemain' => $team->participants_count,
                'Status' => $team->status,
                'Tanggal Daftar' => $team->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $team->updated_at->format('d M Y')
            ];
        })->all();
        
        $mlTeamsArray = $mlTeams->map(function ($team) {
            return [
                'ID' => $team->id,
                'Nama Tim' => $team->team_name,
                'Game' => 'Mobile Legends',
                'Jenis Slot' => $team->slot_type ?? 'Standar',
                'Jumlah Pemain' => $team->participants_count,
                'Status' => $team->status,
                'Tanggal Daftar' => $team->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $team->updated_at->format('d M Y')
            ];
        })->all();
        
        $teams = array_merge($ffTeamsArray, $mlTeamsArray);
        
        return Excel::download(new \App\Exports\TeamsExport($teams), 'all_teams.xlsx');
    }
    
    /**
     * API endpoint untuk mendapatkan data pemain Free Fire
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFFPlayers()
    {
        $players = FF_Participant::with('team')->get();
        
        // Format data untuk frontend
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
    }
    
    /**
     * API endpoint untuk mendapatkan data pemain Mobile Legends
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMLPlayers()
    {
        $players = ML_Participant::with('team')->get();
        
        // Format data untuk frontend
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
    }
    
    /**
     * Export data semua pemain (FF dan ML) ke Excel
     */
    public function exportAllPlayers()
    {
        $ffPlayers = FF_Participant::with('team')->get();
        $mlPlayers = ML_Participant::with('team')->get();
        
        $allPlayersData = [];
        
        foreach ($ffPlayers as $player) {
            $allPlayersData[] = [
                'ID' => $player->id,
                'Nama' => $player->name,
                'Nickname' => $player->nickname,
                'ID Server' => $player->id_server,
                'No. HP' => $player->no_hp,
                'Email' => $player->email,
                'Alamat' => $player->alamat,
                'Role' => $player->role ?? 'Anggota',
                'Tim' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                'Game' => 'Free Fire',
                'Status' => 'Aktif',
                'Tanggal Daftar' => $player->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $player->updated_at->format('d M Y')
            ];
        }
        
        foreach ($mlPlayers as $player) {
            $allPlayersData[] = [
                'ID' => $player->id,
                'Nama' => $player->name,
                'Nickname' => $player->nickname,
                'ID Server' => $player->id_server,
                'No. HP' => $player->no_hp,
                'Email' => $player->email,
                'Alamat' => $player->alamat,
                'Role' => $player->role ?? 'Anggota',
                'Tim' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                'Game' => 'Mobile Legends',
                'Status' => 'Aktif',
                'Tanggal Daftar' => $player->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $player->updated_at->format('d M Y')
            ];
        }
        
        return Excel::download(new \App\Exports\AllPlayersExport($allPlayersData), 'all_players.xlsx');
    }

    /**
     * Export data dan file tim beserta pemain dalam bentuk ZIP
     */
    public function exportFilesAndData()
    {
        try {
            $zipFileName = 'team_data_export_' . date('Y-m-d_H-i-s') . '.zip';
            $zipFilePath = storage_path('app/public/temp/' . $zipFileName);
            
            // Pastikan direktori temp ada
            if (!file_exists(storage_path('app/public/temp'))) {
                mkdir(storage_path('app/public/temp'), 0755, true);
            }
            
            $zip = new \ZipArchive();
            
            if ($zip->open($zipFilePath, \ZipArchive::CREATE) === TRUE) {
                // Persiapkan data untuk export
                $teamsData = $this->prepareTeamsData();
                $playersData = $this->preparePlayersData();
                
                // Tambahkan data tim langsung (tanpa menyimpan file sementara)
                $teamExcel = Excel::raw(new \App\Exports\TeamsExport($teamsData), \Maatwebsite\Excel\Excel::XLSX);
                $zip->addFromString('data/all_teams.xlsx', $teamExcel);
                
                // Tambahkan data pemain langsung (tanpa menyimpan file sementara)
                $playerExcel = Excel::raw(new \App\Exports\AllPlayersExport($playersData), \Maatwebsite\Excel\Excel::XLSX);
                $zip->addFromString('data/all_players.xlsx', $playerExcel);
                
                // Tambahkan file-file dari direktori ML_teams
                $this->addFilesToZip($zip, 'ML_teams', 'files/ML_teams');
                
                // Tambahkan file-file dari direktori FF_teams
                $this->addFilesToZip($zip, 'FF_teams', 'files/FF_teams');
                
                $zip->close();
                
                // Pastikan file ZIP telah dibuat sebelum mengirimkannya
                if (file_exists($zipFilePath)) {
                    return response()->download($zipFilePath)->deleteFileAfterSend(true);
                } else {
                    Log::error('File ZIP tidak ditemukan: ' . $zipFilePath);
                    return response()->json(['error' => 'Gagal membuat file ZIP'], 500);
                }
            }
            
            return response()->json(['error' => 'Tidak dapat membuat file ZIP'], 500);
        } catch (\Exception $e) {
            Log::error('Error dalam membuat ZIP: ' . $e->getMessage());
            return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Persiapkan data tim untuk export
     */
    private function prepareTeamsData()
    {
        $ffTeams = FF_Team::withCount('participants')->get();
        $mlTeams = ML_Team::withCount('participants')->get();
        
        $ffTeamsArray = $ffTeams->map(function ($team) {
            return [
                'ID' => $team->id,
                'Nama Tim' => $team->team_name,
                'Game' => 'Free Fire',
                'Jenis Slot' => 'Single',
                'Jumlah Pemain' => $team->participants_count,
                'Status' => $team->status,
                'Tanggal Daftar' => $team->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $team->updated_at->format('d M Y')
            ];
        })->all();
        
        $mlTeamsArray = $mlTeams->map(function ($team) {
            return [
                'ID' => $team->id,
                'Nama Tim' => $team->team_name,
                'Game' => 'Mobile Legends',
                'Jenis Slot' => $team->slot_type ?? 'Standar',
                'Jumlah Pemain' => $team->participants_count,
                'Status' => $team->status,
                'Tanggal Daftar' => $team->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $team->updated_at->format('d M Y')
            ];
        })->all();
        
        return array_merge($ffTeamsArray, $mlTeamsArray);
    }

    /**
     * Persiapkan data pemain untuk export
     */
    private function preparePlayersData()
    {
        $ffPlayers = FF_Participant::with('team')->get();
        $mlPlayers = ML_Participant::with('team')->get();
        
        $allPlayersData = [];
        
        foreach ($ffPlayers as $player) {
            $allPlayersData[] = [
                'ID' => $player->id,
                'Nama' => $player->name,
                'Nickname' => $player->nickname,
                'ID Server' => $player->id_server,
                'No. HP' => $player->no_hp,
                'Email' => $player->email,
                'Alamat' => $player->alamat,
                'Role' => $player->role ?? 'Anggota',
                'Tim' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                'Game' => 'Free Fire',
                'Status' => 'Aktif',
                'Tanggal Daftar' => $player->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $player->updated_at->format('d M Y')
            ];
        }
        
        foreach ($mlPlayers as $player) {
            $allPlayersData[] = [
                'ID' => $player->id,
                'Nama' => $player->name,
                'Nickname' => $player->nickname,
                'ID Server' => $player->id_server,
                'No. HP' => $player->no_hp,
                'Email' => $player->email,
                'Alamat' => $player->alamat,
                'Role' => $player->role ?? 'Anggota',
                'Tim' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                'Game' => 'Mobile Legends',
                'Status' => 'Aktif',
                'Tanggal Daftar' => $player->created_at->format('d M Y'),
                'Terakhir Diperbarui' => $player->updated_at->format('d M Y')
            ];
        }
        
        return $allPlayersData;
    }

    /**
     * Tambahkan file-file dari direktori tertentu ke dalam ZIP
     */
    private function addFilesToZip($zip, $sourceDir, $zipDir)
    {
        $basePath = storage_path('app/public/' . $sourceDir);
        
        if (!file_exists($basePath)) {
            Log::warning("Direktori tidak ditemukan: {$basePath}");
            return;
        }
        
        try {
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($basePath, \RecursiveDirectoryIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );
            
            foreach ($files as $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($basePath) + 1);
                    
                    if (file_exists($filePath)) {
                        try {
                            $zip->addFile($filePath, $zipDir . '/' . $relativePath);
                        } catch (\Exception $e) {
                            Log::error("Gagal menambahkan file ke ZIP: {$filePath}, error: " . $e->getMessage());
                        }
                    } else {
                        Log::warning("File tidak ditemukan: {$filePath}");
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Error mengakses direktori {$basePath}: " . $e->getMessage());
        }
    }

    /**
     * Menghapus pemain berdasarkan ID dan jenis game
     * 
     * @param string $game jenis game (ff/ml)
     * @param int $id ID pemain
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePlayer($game, $id)
    {
        try {
            if ($game === 'ff') {
                $player = FF_Participant::findOrFail($id);
            } elseif ($game === 'ml') {
                $player = ML_Participant::findOrFail($id);
            } else {
                return response()->json(['error' => 'Jenis game tidak valid'], 400);
            }
            
            // Hapus file yang terkait dengan pemain
            if ($player->foto && Storage::disk('public')->exists($player->foto)) {
                Storage::disk('public')->delete($player->foto);
            }
            
            if ($player->tanda_tangan && Storage::disk('public')->exists($player->tanda_tangan)) {
                Storage::disk('public')->delete($player->tanda_tangan);
            }
            
            // Hapus pemain dari database
            $player->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Pemain berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting player', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus pemain: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Memperbarui data pemain
     * 
     * @param \Illuminate\Http\Request $request
     * @param string $game jenis game (ff/ml)
     * @param int $id ID pemain
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePlayer(Request $request, $game, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'nickname' => 'sometimes|required|string|max:255',
                'role' => 'sometimes|nullable|string|max:255',
                'id_server' => 'sometimes|nullable|string|max:255',
                'no_hp' => 'sometimes|nullable|string|max:20',
                'email' => 'sometimes|nullable|email|max:255',
                'alamat' => 'sometimes|nullable|string|max:255',
                'foto' => 'sometimes|nullable|image|max:2048',
                'tanda_tangan' => 'sometimes|nullable|image|max:2048',
            ]);
            
            if ($game === 'ff') {
                $player = FF_Participant::findOrFail($id);
            } elseif ($game === 'ml') {
                $player = ML_Participant::findOrFail($id);
            } else {
                return response()->json(['error' => 'Jenis game tidak valid'], 400);
            }
            
            // Handle file uploads jika ada
            if ($request->hasFile('foto')) {
                // Hapus foto lama jika ada
                if ($player->foto && Storage::disk('public')->exists($player->foto)) {
                    Storage::disk('public')->delete($player->foto);
                }
                
                // Simpan foto baru
                $fotoPath = $request->file('foto')->store('players/' . ($game === 'ff' ? 'ff' : 'ml') . '/photos', 'public');
                $validatedData['foto'] = $fotoPath;
            }
            
            if ($request->hasFile('tanda_tangan')) {
                // Hapus tanda tangan lama jika ada
                if ($player->tanda_tangan && Storage::disk('public')->exists($player->tanda_tangan)) {
                    Storage::disk('public')->delete($player->tanda_tangan);
                }
                
                // Simpan tanda tangan baru
                $tandaTanganPath = $request->file('tanda_tangan')->store('players/' . ($game === 'ff' ? 'ff' : 'ml') . '/signatures', 'public');
                $validatedData['tanda_tangan'] = $tandaTanganPath;
            }
            
            // Update data pemain
            $player->update($validatedData);
            
            return response()->json([
                'success' => true,
                'message' => 'Data pemain berhasil diperbarui',
                'player' => [
                    'id' => $player->id,
                    'name' => $player->name,
                    'nickname' => $player->nickname,
                    'role' => $player->role ?? 'Player',
                    'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                    'team_name' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                    'created_at' => $player->created_at,
                    'status' => 'active',
                    'id_server' => $player->id_server,
                    'no_hp' => $player->no_hp,
                    'email' => $player->email,
                    'alamat' => $player->alamat,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating player', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data pemain: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Menyaring data pemain berdasarkan kriteria
     * 
     * @param \Illuminate\Http\Request $request
     * @param string $game jenis game (ff/ml)
     * @return \Illuminate\Http\JsonResponse
     */
    public function filterPlayers(Request $request, $game)
    {
        try {
            // Parameter filter yang mungkin
            $search = $request->input('search');
            $role = $request->input('role');
            $team = $request->input('team');
            
            // Query builder berdasarkan jenis game
            if ($game === 'ff') {
                $query = FF_Participant::query()->with('team');
            } elseif ($game === 'ml') {
                $query = ML_Participant::query()->with('team');
            } else {
                return response()->json(['error' => 'Jenis game tidak valid'], 400);
            }
            
            // Terapkan filter
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('nickname', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }
            
            // Filter berdasarkan role
            if ($role && $role !== 'all') {
                $query->where('role', $role);
            }
            
            // Filter berdasarkan team
            if ($team && $team !== '') {
                $query->whereHas('team', function($q) use ($team) {
                    $q->where('team_name', 'like', "%{$team}%");
                });
            }
            
            // Dapatkan hasil
            $players = $query->get();
            
            // Format data untuk frontend
            $formattedPlayers = $players->map(function($player) {
                return [
                    'id' => $player->id,
                    'name' => $player->name,
                    'nickname' => $player->nickname,
                    'role' => $player->role ?? 'Player',
                    'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                    'team_name' => $player->team ? $player->team->team_name : 'Tidak ada tim',
                    'created_at' => $player->created_at,
                    'status' => 'active',
                    'id_server' => $player->id_server,
                    'no_hp' => $player->no_hp,
                    'email' => $player->email,
                    'alamat' => $player->alamat,
                ];
            });
            
            return response()->json($formattedPlayers);
            
        } catch (\Exception $e) {
            Log::error('Error filtering players', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyaring data pemain: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Menghapus tim berdasarkan ID dan jenis game
     * 
     * @param string $game jenis game (ff/ml)
     * @param int $id ID tim
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteTeam($game, $id)
    {
        try {
            // Log awal operasi
            Log::info('Starting to delete team', ['game' => $game, 'id' => $id]);
            
            // Ambil tim berdasarkan jenis game
            $team = null;
            $slotCount = 1; // Default slot count untuk single slot
            
            if ($game === 'ff') {
                // Cek jika tim ada
                $team = FF_Team::findOrFail($id);
                Log::info('Found FF team', ['team_id' => $team->id, 'team_name' => $team->team_name]);
            } elseif ($game === 'ml') {
                // Cek jika tim ada
                $team = ML_Team::findOrFail($id);
                Log::info('Found ML team', ['team_id' => $team->id, 'team_name' => $team->team_name]);
                
                // Ambil info slot type dan count
                $slotType = $team->slot_type ?? 'single';
                $slotCount = $team->slot_count ?? ($slotType === 'double' ? 2 : 1);
                Log::info('Team slot info', [
                    'team_id' => $team->id,
                    'slot_type' => $slotType,
                    'slot_count' => $slotCount
                ]);
            } else {
                Log::warning('Invalid game type provided', ['game' => $game]);
                return response()->json(['success' => false, 'message' => 'Jenis game tidak valid'], 400);
            }
            
            // Simpan informasi tim untuk respons
            $teamInfo = [
                'id' => $team->id,
                'name' => $team->team_name,
                'game' => $game === 'ff' ? 'Free Fire' : 'Mobile Legends'
            ];
            
            // Proses pengembalian slot sebelum menghapus tim
            try {
                $competitionName = $game === 'ff' ? 'Free Fire' : 'Mobile Legends';
                $slot = \App\Models\CompetitionSlot::where('competition_name', $competitionName)->first();
                
                if ($slot) {
                    Log::info('Decreasing competition slot in TeamPlayerController', [
                        'team_id' => $team->id,
                        'team_name' => $team->team_name,
                        'competition' => $competitionName,
                        'slot_count' => $slotCount,
                        'used_slots_before' => $slot->used_slots
                    ]);
                    
                    // Hapus tim dari database
                    $team->delete();
                    Log::info('Team deleted from database', ['team_id' => $team->id, 'team_name' => $team->team_name]);
                    
                    // Pastikan slot kompetisi sinkron dengan data aktual
                    if ($game === 'ml') {
                        // Hitung ulang slot ML yang terpakai
                        $mlSlotsUsed = DB::table('ml_teams')
                            ->select(DB::raw('COALESCE(SUM(CASE WHEN slot_type = "double" THEN 2 WHEN slot_type = "single" THEN 1 ELSE COALESCE(slot_count, 1) END), 0) as total_slots'))
                            ->first()->total_slots;
                            
                        $slot->used_slots = $mlSlotsUsed;
                    } else {
                        // Untuk FF, jumlah tim = jumlah slot
                        $slot->used_slots = FF_Team::count();
                    }
                    
                    $slot->save();
                    
                    Log::info('Competition slot updated after team deletion', [
                        'competition' => $competitionName,
                        'new_used_slots' => $slot->used_slots
                    ]);
                }
            } catch (\Exception $e) {
                Log::error('Error updating slot after team deletion', [
                    'team_id' => $team->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Tim dan semua pemainnya berhasil dihapus',
                'team' => $teamInfo,
                'redirect' => [
                    'path' => '/lomba', // Redirect ke halaman lomba
                    'params' => [
                        'tab' => $game === 'ff' ? 'free-fire' : 'mobile-legends'
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting team', [
                'game' => $game,
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus tim: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Memperbarui data tim
     * 
     * @param \Illuminate\Http\Request $request
     * @param string $game jenis game (ff/ml)
     * @param int $id ID tim
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTeam(Request $request, $game, $id)
    {
        try {
            $validatedData = $request->validate([
                'team_name' => 'sometimes|required|string|max:255',
                'status' => 'sometimes|required|in:pending,verified,rejected',
                'slot_type' => 'sometimes|nullable|string|max:255', // hanya untuk ML
                'team_logo' => 'sometimes|nullable|image|max:2048',
                'proof_of_payment' => 'sometimes|nullable|image|max:2048',
            ]);
            
            if ($game === 'ff') {
                $team = FF_Team::findOrFail($id);
            } elseif ($game === 'ml') {
                $team = ML_Team::findOrFail($id);
            } else {
                return response()->json(['error' => 'Jenis game tidak valid'], 400);
            }
            
            // Handle file uploads jika ada
            if ($request->hasFile('team_logo')) {
                // Hapus logo lama jika ada
                if ($team->team_logo && Storage::disk('public')->exists($team->team_logo)) {
                    Storage::disk('public')->delete($team->team_logo);
                }
                
                // Simpan logo baru
                $logoPath = $request->file('team_logo')->store('teams/' . ($game === 'ff' ? 'ff' : 'ml') . '/logos', 'public');
                $validatedData['team_logo'] = $logoPath;
            }
            
            if ($request->hasFile('proof_of_payment')) {
                // Hapus bukti pembayaran lama jika ada
                if ($team->proof_of_payment && Storage::disk('public')->exists($team->proof_of_payment)) {
                    Storage::disk('public')->delete($team->proof_of_payment);
                }
                
                // Simpan bukti pembayaran baru
                $paymentPath = $request->file('proof_of_payment')->store('teams/' . ($game === 'ff' ? 'ff' : 'ml') . '/payments', 'public');
                $validatedData['proof_of_payment'] = $paymentPath;
            }
            
            // Update data tim
            $team->update($validatedData);
            
            // Data yang akan dikembalikan ke frontend
            $responseData = [
                'id' => $team->id,
                'name' => $team->team_name,
                'game' => $game === 'ff' ? 'Free Fire' : 'Mobile Legends',
                'playerCount' => $team->participants()->count(),
                'logo' => $team->team_logo ? asset('storage/' . $team->team_logo) : null,
                'payment_proof' => $team->proof_of_payment ? asset('storage/' . $team->proof_of_payment) : null,
                'status' => $team->status,
                'created_at' => $team->created_at->format('d M Y'),
            ];
            
            // Tambahkan informasi slot_type untuk Mobile Legends
            if ($game === 'ml') {
                $responseData['slot_type'] = $team->slot_type;
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Data tim berhasil diperbarui',
                'team' => $responseData
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error updating team', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui data tim: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Menyaring data tim berdasarkan kriteria
     * 
     * @param \Illuminate\Http\Request $request
     * @param string $game jenis game (ff/ml)
     * @return \Illuminate\Http\JsonResponse
     */
    public function filterTeams(Request $request, $game)
    {
        try {
            // Parameter filter yang mungkin
            $search = $request->input('search');
            $status = $request->input('status');
            $slotType = $request->input('slot_type'); // hanya untuk ML
            
            // Query builder berdasarkan jenis game
            if ($game === 'ff') {
                $query = FF_Team::query()->withCount('participants');
            } elseif ($game === 'ml') {
                $query = ML_Team::query()->withCount('participants');
            } else {
                return response()->json(['error' => 'Jenis game tidak valid'], 400);
            }
            
            // Terapkan filter
            if ($search) {
                $query->where('team_name', 'like', "%{$search}%");
            }
            
            if ($status) {
                $query->where('status', $status);
            }
            
            if ($game === 'ml' && $slotType) {
                $query->where('slot_type', $slotType);
            }
            
            // Dapatkan hasil
            $teams = $query->get();
            
            // Format data untuk frontend
            if ($game === 'ff') {
                $formattedTeams = $teams->map(function($team) {
                    return [
                        'id' => $team->id,
                        'name' => $team->team_name,
                        'game' => 'Free Fire',
                        'playerCount' => $team->participants_count,
                        'achievements' => $team->achievements ?? 0,
                        'logo' => $team->team_logo ? asset('storage/' . $team->team_logo) : '/placeholder.svg',
                        'color' => 'from-orange-500 to-red-600',
                        'status' => $team->status,
                        'slot_type' => 'Single',
                        'created_at' => $team->created_at->format('d M Y'),
                    ];
                });
            } else {
                $formattedTeams = $teams->map(function($team) {
                    return [
                        'id' => $team->id,
                        'name' => $team->team_name,
                        'game' => 'Mobile Legends',
                        'playerCount' => $team->participants_count,
                        'achievements' => $team->achievements ?? 0,
                        'logo' => $team->team_logo ? asset('storage/' . $team->team_logo) : '/placeholder.svg',
                        'color' => 'from-blue-500 to-purple-600',
                        'status' => $team->status,
                        'slot_type' => $team->slot_type ?? 'Standar',
                        'created_at' => $team->created_at->format('d M Y'),
                    ];
                });
            }
            
            return response()->json($formattedTeams);
            
        } catch (\Exception $e) {
            Log::error('Error filtering teams', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyaring data tim: ' . $e->getMessage()
            ], 500);
        }
    }

    // Mendapatkan semua tim Free Fire
    public function getFFTeams()
    {
        $teams = FF_Team::withCount('participants as participant_count')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($teams);
    }
    
    // Mendapatkan semua tim Mobile Legends
    public function getMLTeams()
    {
        $teams = ML_Team::withCount('participants as participant_count')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($teams);
    }
    
    // Halaman pengelolaan tim
    public function teamManagement()
    {
        return Inertia::render('admin/TeamManagement/index');
    }

    /**
     * API endpoint untuk mendapatkan data pemain Free Fire berdasarkan tim
     * 
     * @param int $team_id ID tim
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFFPlayersByTeam($team_id)
    {
        $players = FF_Participant::where('team_id', $team_id)->get();
        
        // Format data untuk frontend
        $formattedPlayers = $players->map(function($player) {
            return [
                'id' => $player->id,
                'name' => $player->name,
                'nickname' => $player->nickname,
                'id_server' => $player->id_server,
                'role' => $player->role ?? 'Player',
                'no_hp' => $player->no_hp,
                'email' => $player->email,
                'alamat' => $player->alamat,
                'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                'tanda_tangan' => $player->tanda_tangan ? asset('storage/' . $player->tanda_tangan) : null,
                'created_at' => $player->created_at->format('d M Y'),
                'status' => 'active'
            ];
        });
        
        return response()->json($formattedPlayers);
    }
    
    /**
     * API endpoint untuk mendapatkan data pemain Mobile Legends berdasarkan tim
     * 
     * @param int $team_id ID tim
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMLPlayersByTeam($team_id)
    {
        $players = ML_Participant::where('team_id', $team_id)->get();
        
        // Format data untuk frontend
        $formattedPlayers = $players->map(function($player) {
            return [
                'id' => $player->id,
                'name' => $player->name,
                'nickname' => $player->nickname,
                'id_server' => $player->id_server,
                'role' => $player->role ?? 'Player',
                'no_hp' => $player->no_hp,
                'email' => $player->email,
                'alamat' => $player->alamat,
                'foto' => $player->foto ? asset('storage/' . $player->foto) : null,
                'tanda_tangan' => $player->tanda_tangan ? asset('storage/' . $player->tanda_tangan) : null,
                'created_at' => $player->created_at->format('d M Y'),
                'status' => 'active'
            ];
        });
        
        return response()->json($formattedPlayers);
    }
}
