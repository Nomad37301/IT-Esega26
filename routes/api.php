<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompetitionSlotController;
use App\Http\Controllers\Admin\TeamPlayerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Competition Slot routes
Route::prefix('competition-slots')->group(function () {
    Route::get('/', [CompetitionSlotController::class, 'getAll']);
    Route::get('/{competitionName}', [CompetitionSlotController::class, 'getByName']);
    Route::get('/{competitionName}/validate', [CompetitionSlotController::class, 'validateAvailability']);
    Route::get('/{competitionName}/validate/{slotType}', [CompetitionSlotController::class, 'validateSlotType']);
    Route::post('/{competitionName}/increment', [CompetitionSlotController::class, 'incrementSlot']);
    Route::post('/{competitionName}/increment-by-type', [CompetitionSlotController::class, 'incrementSlotByType']);
    Route::post('/{competitionName}/decrement', [CompetitionSlotController::class, 'decrementSlot']);
    Route::post('/{competitionName}/decrement-by-type', [CompetitionSlotController::class, 'decrementSlotByType']);
    
    // Rute tambahan untuk debugging
    Route::get('/debug/all', function() {
        $slots = \App\Models\CompetitionSlot::all();
        return response()->json([
            'success' => true,
            'count' => $slots->count(),
            'data' => $slots,
            'names' => $slots->pluck('competition_name')->toArray()
        ]);
    });
    
    // Mengurangi slot secara manual (untuk testing)
    Route::post('/debug/decrement/{name}/{count?}', function($name, $count = 1) {
        $slot = \App\Models\CompetitionSlot::where('competition_name', $name)->first();
        if (!$slot) {
            return response()->json([
                'success' => false,
                'message' => 'Slot not found with name: ' . $name,
                'available_names' => \App\Models\CompetitionSlot::pluck('competition_name')->toArray()
            ], 404);
        }
        
        $result = $slot->decrementUsedSlots((int)$count);
        return response()->json([
            'success' => $result,
            'message' => $result ? 'Slot decremented successfully' : 'Failed to decrement slot',
            'before_refresh' => [
                'name' => $slot->competition_name,
                'used_slots' => $slot->used_slots,
                'total_slots' => $slot->total_slots
            ],
            'after_refresh' => [
                'name' => $slot->fresh()->competition_name,
                'used_slots' => $slot->fresh()->used_slots, 
                'total_slots' => $slot->fresh()->total_slots
            ]
        ]);
    });
});

// Debugging routes
Route::prefix('debug')->group(function() {
    // Melihat data tim
    Route::get('/teams/{type?}', function($type = null) {
        if ($type === 'ml') {
            $teams = \App\Models\ML_Team::all();
            return response()->json([
                'success' => true,
                'count' => $teams->count(),
                'data' => $teams
            ]);
        } else if ($type === 'ff') {
            $teams = \App\Models\FF_Team::all();
            return response()->json([
                'success' => true,
                'count' => $teams->count(),
                'data' => $teams
            ]);
        } else {
            $mlTeams = \App\Models\ML_Team::all();
            $ffTeams = \App\Models\FF_Team::all();
            return response()->json([
                'success' => true,
                'ml_teams_count' => $mlTeams->count(),
                'ff_teams_count' => $ffTeams->count(),
                'ml_teams' => $mlTeams,
                'ff_teams' => $ffTeams
            ]);
        }
    });
    
    // Inisialisasi atau reset slot
    Route::post('/init-slots', function() {
        // Hapus data slot lama
        \App\Models\CompetitionSlot::truncate();
        
        // Buat data baru
        \App\Models\CompetitionSlot::create([
            'competition_name' => 'ml',
            'total_slots' => 64,
            'used_slots' => 0,
            'is_active' => true
        ]);
        
        \App\Models\CompetitionSlot::create([
            'competition_name' => 'ff',
            'total_slots' => 48,
            'used_slots' => 0,
            'is_active' => true
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Slots initialized successfully',
            'data' => \App\Models\CompetitionSlot::all()
        ]);
    });
    
    // Melihat nama tabel-tabel di database
    Route::get('/tables', function() {
        $tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
        return response()->json([
            'success' => true,
            'tables' => $tables
        ]);
    });
});

// API untuk Team Management
Route::prefix('teams')->group(function () {
    // Get teams
    Route::get('/ff', [TeamPlayerController::class, 'getFFTeams']);
    Route::get('/ml', [TeamPlayerController::class, 'getMLTeams']);
    
    // Filter teams
    Route::get('/ff/filter', [TeamPlayerController::class, 'filterTeams']);
    Route::get('/ml/filter', [TeamPlayerController::class, 'filterTeams']);
    
    // Update and delete teams
    Route::put('/ff/{id}', [TeamPlayerController::class, 'updateTeam']);
    Route::put('/ml/{id}', [TeamPlayerController::class, 'updateTeam']);
    Route::delete('/ff/{id}', function($id) {
        return app()->call([app(TeamPlayerController::class), 'deleteTeam'], ['game' => 'ff', 'id' => $id]);
    });
    Route::delete('/ml/{id}', function($id) {
        return app()->call([app(TeamPlayerController::class), 'deleteTeam'], ['game' => 'ml', 'id' => $id]);
    });
});

// API untuk Player Management
Route::prefix('players')->group(function () {
    // Get players by team
    Route::get('/ff/{team_id}', [TeamPlayerController::class, 'getFFPlayersByTeam']);
    Route::get('/ml/{team_id}', [TeamPlayerController::class, 'getMLPlayersByTeam']);
    
    // Update and delete players
    Route::put('/ff/{id}', [TeamPlayerController::class, 'updatePlayer']);
    Route::put('/ml/{id}', [TeamPlayerController::class, 'updatePlayer']);
    Route::delete('/ff/{id}', [TeamPlayerController::class, 'deletePlayer']);
    Route::delete('/ml/{id}', [TeamPlayerController::class, 'deletePlayer']);
});

// Get all FF players
Route::get('/ff-players', [TeamPlayerController::class, 'getFFPlayers']);

// Get all ML players 
Route::get('/ml-players', [TeamPlayerController::class, 'getMLPlayers']);

// Admin routes
Route::middleware(['auth:sanctum', 'verified'])->group(function() {
    // ... existing routes ...
    
    // Slot management routes
    Route::get('/admin/slots/status', [App\Http\Controllers\Admin\SlotManagementController::class, 'getSlotStatus']);
    Route::post('/admin/slots/sync', [App\Http\Controllers\Admin\SlotManagementController::class, 'syncSlots']);
    
    // ... existing routes ...
});