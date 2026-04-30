<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bracket;

class BracketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mlBrackets = [
            ['game_name' => 'ML', 'stage_name' => 'Qualification Day 1', 'group_name' => 'A', 'slug' => 'ml-day1-a', 'bracket_url' => 'https://challonge.com/A_ITESEGA2025/module', 'order_position' => 1],
            ['game_name' => 'ML', 'stage_name' => 'Qualification Day 1', 'group_name' => 'B', 'slug' => 'ml-day1-b', 'bracket_url' => 'https://challonge.com/B_ITESEGA2025/module', 'order_position' => 2],
            ['game_name' => 'ML', 'stage_name' => 'Qualification Day 1', 'group_name' => 'C', 'slug' => 'ml-day1-c', 'bracket_url' => 'https://challonge.com/C_ITESEGA2025/module', 'order_position' => 3],
        ];

        foreach ($mlBrackets as $data) {
            Bracket::create($data);
        }

        Bracket::create([
            'game_name' => 'FF',
            'stage_name' => 'Final Day',
            'group_name' => null,
            'slug' => 'ff-final',
            'bracket_url' => 'https://challonge.com/PO_ITESEGA2025/module',
            'order_position' => 1
        ]);
    }
}
