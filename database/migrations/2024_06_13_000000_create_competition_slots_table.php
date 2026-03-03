<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('competition_slots', function (Blueprint $table) {
            $table->id();
            $table->string('competition_name');
            $table->integer('total_slots')->default(0);
            $table->integer('used_slots')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tambahkan data awal
        $this->seedInitialData();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('competition_slots');
    }

    /**
     * Seed data awal untuk lomba
     */
    private function seedInitialData(): void
    {
        DB::table('competition_slots')->insert([
            [
                'competition_name' => 'Mobile Legends',
                'total_slots' => 64,
                'used_slots' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'competition_name' => 'Free Fire',
                'total_slots' => 48,
                'used_slots' => 0,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
};