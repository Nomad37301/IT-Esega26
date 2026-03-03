<?php

namespace App\Console\Commands;

use App\Models\CompetitionSlot;
use App\Models\FF_Team;
use App\Models\ML_Team;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncCompetitionSlots extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'competition:sync-slots {--force : Force sync without confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync competition slots with the actual count of teams in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting competition slots synchronization...');

        // Get current slot information
        $mlSlot = CompetitionSlot::where('competition_name', 'Mobile Legends')->first();
        $ffSlot = CompetitionSlot::where('competition_name', 'Free Fire')->first();

        if (!$mlSlot || !$ffSlot) {
            $this->error('Competition slots not found in database!');
            return 1;
        }

        // Count actual teams
        $mlTeamsCount = ML_Team::count();
        
        // Calculate actual ML slots used (considering single and double slots)
        $mlSlotsUsed = DB::table('ml_teams')
            ->select(DB::raw('SUM(CASE WHEN slot_type = "double" THEN 2 WHEN slot_type = "single" THEN 1 ELSE COALESCE(slot_count, 1) END) as total_slots'))
            ->first()->total_slots ?? 0;
            
        $ffSlotsUsed = FF_Team::count(); // FF teams always use 1 slot

        $this->info('Current situation:');
        $this->table(
            ['Competition', 'DB Used Slots', 'Actual Used Slots', 'Difference'],
            [
                ['Mobile Legends', $mlSlot->used_slots, $mlSlotsUsed, $mlSlot->used_slots - $mlSlotsUsed],
                ['Free Fire', $ffSlot->used_slots, $ffSlotsUsed, $ffSlot->used_slots - $ffSlotsUsed],
            ]
        );

        if ($mlSlot->used_slots == $mlSlotsUsed && $ffSlot->used_slots == $ffSlotsUsed) {
            $this->info('Slots are already in sync with the database. No updates needed.');
            return 0;
        }

        if (!$this->option('force') && !$this->confirm('Do you want to sync the slots with the actual team counts?')) {
            $this->info('Operation cancelled by user.');
            return 0;
        }

        try {
            DB::beginTransaction();

            // Update ML slot
            $mlSlot->used_slots = $mlSlotsUsed;
            $mlSlot->save();
            
            // Update FF slot
            $ffSlot->used_slots = $ffSlotsUsed;
            $ffSlot->save();

            DB::commit();

            $this->info('Slots synchronized successfully!');
            $this->table(
                ['Competition', 'New Used Slots'],
                [
                    ['Mobile Legends', $mlSlot->used_slots],
                    ['Free Fire', $ffSlot->used_slots],
                ]
            );

            Log::info('Competition slots synchronized', [
                'ml_slots' => $mlSlotsUsed,
                'ff_slots' => $ffSlotsUsed
            ]);

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Error synchronizing slots: ' . $e->getMessage());
            Log::error('Error synchronizing competition slots', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }
    }
}
