<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompetitionSlot;
use App\Models\FF_Team;
use App\Models\ML_Team;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SlotManagementController extends Controller
{
    /**
     * Mendapatkan status slot kompetisi saat ini
     */
    public function getSlotStatus(): JsonResponse
    {
        try {
            $mlSlot = CompetitionSlot::where('competition_name', 'Mobile Legends')->first();
            $ffSlot = CompetitionSlot::where('competition_name', 'Free Fire')->first();
            
            // Hitung slot aktual yang digunakan
            $mlSlotsUsed = DB::table('ml_teams')
                ->select(DB::raw('COALESCE(SUM(CASE WHEN slot_type = "double" THEN 2 WHEN slot_type = "single" THEN 1 ELSE COALESCE(slot_count, 1) END), 0) as total_slots'))
                ->first()->total_slots;
                
            $ffSlotsUsed = FF_Team::count(); // FF teams always use 1 slot
            
            // Deteksi apakah jumlah slot saat ini sesuai dengan perhitungan aktual
            $mlIsSynced = ($mlSlot && $mlSlot->used_slots == $mlSlotsUsed);
            $ffIsSynced = ($ffSlot && $ffSlot->used_slots == $ffSlotsUsed);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'ml' => [
                        'total_slots' => $mlSlot->total_slots ?? 0,
                        'db_used_slots' => $mlSlot->used_slots ?? 0,
                        'actual_used_slots' => $mlSlotsUsed,
                        'difference' => ($mlSlot ? $mlSlot->used_slots : 0) - $mlSlotsUsed,
                        'is_synced' => $mlIsSynced,
                    ],
                    'ff' => [
                        'total_slots' => $ffSlot->total_slots ?? 0,
                        'db_used_slots' => $ffSlot->used_slots ?? 0,
                        'actual_used_slots' => $ffSlotsUsed,
                        'difference' => ($ffSlot ? $ffSlot->used_slots : 0) - $ffSlotsUsed,
                        'is_synced' => $ffIsSynced,
                    ],
                    'needs_sync' => !$mlIsSynced || !$ffIsSynced
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting slot status', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error getting slot status: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Sinkronkan jumlah slot yang digunakan dengan jumlah tim aktual
     */
    public function syncSlots(): JsonResponse
    {
        try {
            DB::beginTransaction();
            
            $mlSlot = CompetitionSlot::where('competition_name', 'Mobile Legends')->first();
            $ffSlot = CompetitionSlot::where('competition_name', 'Free Fire')->first();
            
            if (!$mlSlot || !$ffSlot) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Competition slots not found in database'
                ], 404);
            }
            
            // Calculate actual slots used
            $mlSlotsUsed = DB::table('ml_teams')
                ->select(DB::raw('COALESCE(SUM(CASE WHEN slot_type = "double" THEN 2 WHEN slot_type = "single" THEN 1 ELSE COALESCE(slot_count, 1) END), 0) as total_slots'))
                ->first()->total_slots;
                
            $ffSlotsUsed = FF_Team::count(); // FF teams always use 1 slot
            
            // Store old values for logging
            $oldMlSlots = $mlSlot->used_slots;
            $oldFfSlots = $ffSlot->used_slots;
            
            // Update slots
            $mlSlot->used_slots = $mlSlotsUsed;
            $mlSlot->save();
            
            $ffSlot->used_slots = $ffSlotsUsed;
            $ffSlot->save();
            
            DB::commit();
            
            Log::info('Competition slots synchronized', [
                'ml' => [
                    'old' => $oldMlSlots,
                    'new' => $mlSlotsUsed,
                ],
                'ff' => [
                    'old' => $oldFfSlots,
                    'new' => $ffSlotsUsed,
                ]
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Slots synchronized successfully',
                'data' => [
                    'ml' => [
                        'old_used_slots' => $oldMlSlots,
                        'new_used_slots' => $mlSlotsUsed,
                        'difference' => $mlSlotsUsed - $oldMlSlots
                    ],
                    'ff' => [
                        'old_used_slots' => $oldFfSlots,
                        'new_used_slots' => $ffSlotsUsed,
                        'difference' => $ffSlotsUsed - $oldFfSlots
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error synchronizing slots', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error synchronizing slots: ' . $e->getMessage()
            ], 500);
        }
    }
}
