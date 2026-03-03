<?php

namespace App\Http\Controllers;

use App\Models\CompetitionSlot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class CompetitionSlotController extends Controller
{
    /**
     * Mendapatkan data slot untuk semua lomba
     */
    public function getAll()
    {
        $slots = CompetitionSlot::all();
        
        Log::info('Getting all competition slots', ['count' => $slots->count()]);
        
        return response()->json([
            'success' => true,
            'data' => $slots
        ]);
    }
    
    /**
     * Mendapatkan data slot berdasarkan nama lomba
     */
    public function getByName(string $competitionName)
    {
        $slot = CompetitionSlot::where('competition_name', $competitionName)->first();
        
        if (!$slot) {
            Log::warning('Competition not found', ['competition_name' => $competitionName]);
            return response()->json([
                'success' => false,
                'message' => 'Kompetisi tidak ditemukan'
            ], 404);
        }
        
        Log::info('Getting competition slot', [
            'competition_name' => $competitionName, 
            'available_slots' => $slot->getAvailableSlots()
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $slot
        ]);
    }
    
    /**
     * Validasi apakah slot masih tersedia
     */
    public function validateAvailability(string $competitionName): JsonResponse
    {
        $slot = CompetitionSlot::where('competition_name', $competitionName)->first();
        
        if (!$slot) {
            Log::warning('Competition not found in validateAvailability', ['competition_name' => $competitionName]);
            return response()->json([
                'available' => false,
                'message' => 'Kompetisi tidak ditemukan'
            ]);
        }
        
        $hasSlot = $slot->hasAvailableSlots();
        $availableSlots = $slot->getAvailableSlots();
        
        Log::info('Validating slot availability', [
            'competition_name' => $competitionName,
            'available' => $hasSlot,
            'available_slots' => $availableSlots,
            'total_slots' => $slot->total_slots,
            'used_slots' => $slot->used_slots
        ]);
        
        return response()->json([
            'available' => $hasSlot,
            'availableSlots' => $availableSlots,
            'totalSlots' => $slot->total_slots,
            'usedSlots' => $slot->used_slots,
            'filledPercentage' => $slot->getFilledPercentage(),
            'message' => $hasSlot ? 'Slot tersedia' : 'Slot penuh'
        ]);
    }
    
    /**
     * Validasi apakah slot masih tersedia berdasarkan tipe slot
     */
    public function validateSlotType(string $competitionName, string $slotType): JsonResponse
    {
        $slot = CompetitionSlot::where('competition_name', $competitionName)->first();
        
        if (!$slot) {
            Log::warning('Competition not found in validateSlotType', [
                'competition_name' => $competitionName,
                'slot_type' => $slotType
            ]);
            return response()->json([
                'available' => false,
                'message' => 'Kompetisi tidak ditemukan'
            ]);
        }
        
        // Hitung berapa slot yang dibutuhkan
        $requiredSlots = ($slotType === 'double') ? 2 : 1;
        
        // Cek apakah tersedia
        $availableSlots = $slot->getAvailableSlots();
        $isAvailable = $availableSlots >= $requiredSlots;
        
        Log::info('Validating slot type availability', [
            'competition_name' => $competitionName,
            'slot_type' => $slotType,
            'required_slots' => $requiredSlots,
            'available_slots' => $availableSlots,
            'is_available' => $isAvailable
        ]);
        
        return response()->json([
            'available' => $isAvailable,
            'availableSlots' => $availableSlots,
            'requiredSlots' => $requiredSlots,
            'totalSlots' => $slot->total_slots,
            'usedSlots' => $slot->used_slots,
            'filledPercentage' => $slot->getFilledPercentage(),
            'message' => $isAvailable 
                ? "Slot tersedia (butuh {$requiredSlots} slot)" 
                : "Slot tidak mencukupi untuk tipe {$slotType}"
        ]);
    }
    
    /**
     * Increment slot yang digunakan
     */
    public function incrementSlot(Request $request, string $competitionName): JsonResponse
    {
        $slot = CompetitionSlot::where('competition_name', $competitionName)->first();
        
        if (!$slot) {
            Log::warning('Competition not found in incrementSlot', ['competition_name' => $competitionName]);
            return response()->json([
                'success' => false,
                'message' => 'Kompetisi tidak ditemukan'
            ], 404);
        }
        
        $count = $request->input('count', 1);
        
        Log::info('Incrementing slot', [
            'competition_name' => $competitionName,
            'count' => $count,
            'before_used_slots' => $slot->used_slots,
            'available_slots' => $slot->getAvailableSlots()
        ]);
        
        if (!$slot->hasAvailableSlots() || $slot->used_slots + $count > $slot->total_slots) {
            Log::warning('Not enough slots', [
                'competition_name' => $competitionName,
                'requested_count' => $count,
                'available_slots' => $slot->getAvailableSlots()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Slot tidak mencukupi',
                'availableSlots' => $slot->getAvailableSlots(),
                'requestedSlots' => $count
            ], 400);
        }
        
        if ($slot->incrementUsedSlots($count)) {
            Log::info('Slot incremented successfully', [
                'competition_name' => $competitionName,
                'count' => $count,
                'after_used_slots' => $slot->used_slots,
                'available_slots' => $slot->getAvailableSlots()
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Slot berhasil ditambahkan',
                'availableSlots' => $slot->getAvailableSlots(),
                'totalSlots' => $slot->total_slots,
                'usedSlots' => $slot->used_slots
            ]);
        }
        
        Log::error('Failed to increment slot', [
            'competition_name' => $competitionName,
            'count' => $count
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Gagal menambahkan slot'
        ], 500);
    }
    
    /**
     * Increment slot yang digunakan berdasarkan tipe slot
     */
    public function incrementSlotByType(Request $request, string $competitionName): JsonResponse
    {
        $slot = CompetitionSlot::where('competition_name', $competitionName)->first();
        
        if (!$slot) {
            Log::warning('Competition not found in incrementSlotByType', ['competition_name' => $competitionName]);
            return response()->json([
                'success' => false,
                'message' => 'Kompetisi tidak ditemukan'
            ], 404);
        }
        
        $slotType = $request->input('slot_type', 'single');
        $count = ($slotType === 'double') ? 2 : 1;
        
        Log::info('Incrementing slot by type', [
            'competition_name' => $competitionName,
            'slot_type' => $slotType,
            'count' => $count,
            'before_used_slots' => $slot->used_slots,
            'available_slots' => $slot->getAvailableSlots()
        ]);
        
        if (!$slot->hasAvailableSlots() || $slot->used_slots + $count > $slot->total_slots) {
            Log::warning('Not enough slots for type', [
                'competition_name' => $competitionName,
                'slot_type' => $slotType,
                'count' => $count,
                'available_slots' => $slot->getAvailableSlots()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Slot tidak mencukupi',
                'availableSlots' => $slot->getAvailableSlots(),
                'requestedSlots' => $count
            ], 400);
        }
        
        if ($slot->incrementUsedSlots($count)) {
            Log::info('Slot incremented by type successfully', [
                'competition_name' => $competitionName,
                'slot_type' => $slotType,
                'count' => $count,
                'after_used_slots' => $slot->used_slots,
                'available_slots' => $slot->getAvailableSlots()
            ]);
            return response()->json([
                'success' => true,
                'message' => "Berhasil menambahkan {$count} slot",
                'availableSlots' => $slot->getAvailableSlots(),
                'totalSlots' => $slot->total_slots,
                'usedSlots' => $slot->used_slots,
                'slotType' => $slotType
            ]);
        }
        
        Log::error('Failed to increment slot by type', [
            'competition_name' => $competitionName,
            'slot_type' => $slotType,
            'count' => $count
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Gagal menambahkan slot'
        ], 500);
    }
    
    /**
     * Decrement slot yang digunakan
     */
    public function decrementSlot(Request $request, string $competitionName): JsonResponse
    {
        $slot = CompetitionSlot::where('competition_name', $competitionName)->first();
        
        if (!$slot) {
            Log::warning('Competition not found in decrementSlot', ['competition_name' => $competitionName]);
            return response()->json([
                'success' => false,
                'message' => 'Kompetisi tidak ditemukan'
            ], 404);
        }
        
        $count = $request->input('count', 1);
        
        Log::info('Decrementing slot', [
            'competition_name' => $competitionName,
            'count' => $count,
            'before_used_slots' => $slot->used_slots
        ]);
        
        if ($slot->decrementUsedSlots($count)) {
            Log::info('Slot decremented successfully', [
                'competition_name' => $competitionName,
                'count' => $count,
                'after_used_slots' => $slot->used_slots,
                'available_slots' => $slot->getAvailableSlots()
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Slot berhasil dikurangi',
                'availableSlots' => $slot->getAvailableSlots(),
                'totalSlots' => $slot->total_slots,
                'usedSlots' => $slot->used_slots
            ]);
        }
        
        Log::error('Failed to decrement slot', [
            'competition_name' => $competitionName,
            'count' => $count
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengurangi slot'
        ], 500);
    }
    
    /**
     * Decrement slot yang digunakan berdasarkan tipe slot
     */
    public function decrementSlotByType(Request $request, string $competitionName): JsonResponse
    {
        $slot = CompetitionSlot::where('competition_name', $competitionName)->first();
        
        if (!$slot) {
            Log::warning('Competition not found in decrementSlotByType', ['competition_name' => $competitionName]);
            return response()->json([
                'success' => false,
                'message' => 'Kompetisi tidak ditemukan'
            ], 404);
        }
        
        $slotType = $request->input('slot_type', 'single');
        $count = ($slotType === 'double') ? 2 : 1;
        
        Log::info('Decrementing slot by type', [
            'competition_name' => $competitionName,
            'slot_type' => $slotType,
            'count' => $count,
            'before_used_slots' => $slot->used_slots
        ]);
        
        if ($slot->decrementUsedSlots($count)) {
            Log::info('Slot decremented by type successfully', [
                'competition_name' => $competitionName,
                'slot_type' => $slotType,
                'count' => $count,
                'after_used_slots' => $slot->used_slots,
                'available_slots' => $slot->getAvailableSlots()
            ]);
            return response()->json([
                'success' => true,
                'message' => "Berhasil mengurangi {$count} slot",
                'availableSlots' => $slot->getAvailableSlots(),
                'totalSlots' => $slot->total_slots,
                'usedSlots' => $slot->used_slots,
                'slotType' => $slotType
            ]);
        }
        
        Log::error('Failed to decrement slot by type', [
            'competition_name' => $competitionName,
            'slot_type' => $slotType,
            'count' => $count
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Gagal mengurangi slot'
        ], 500);
    }
}