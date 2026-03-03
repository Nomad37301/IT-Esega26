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
        Schema::create('ml_teams', function (Blueprint $table) {
            $table->id();
            $table->string('team_name')->unique(); // Nama tim
            $table->string('slot_type')->default('double'); // Default ke double slot
            $table->integer('slot_count')->default(2); // Default ke 2 slot untuk double
            $table->string('team_logo')->nullable(); // Logo tim
            $table->string('proof_of_payment')->nullable(); // Bukti pembayaran
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Status pendaftaran
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ml_teams');
    }
};
