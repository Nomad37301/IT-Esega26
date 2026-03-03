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
        // Hanya lakukan migrasi jika tabel belum memiliki kolom yang diperlukan
        
        // Buat tabel jika belum ada
        if (!Schema::hasTable('ml_teams')) {
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
        // Jika tabel sudah ada tapi kolom belum
        else if (Schema::hasTable('ml_teams')) {
            if (!Schema::hasColumn('ml_teams', 'slot_type')) {
                Schema::table('ml_teams', function (Blueprint $table) {
                    $table->string('slot_type')->default('double')->after('team_name'); // 'double' atau 'single'
                });
            }
            
            if (!Schema::hasColumn('ml_teams', 'slot_count')) {
                Schema::table('ml_teams', function (Blueprint $table) {
                    $table->integer('slot_count')->default(2)->after('slot_type'); // 2 untuk double, 1 untuk single
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Hapus kolom jika ada
        if (Schema::hasTable('ml_teams')) {
            Schema::table('ml_teams', function (Blueprint $table) {
                if (Schema::hasColumn('ml_teams', 'slot_type')) {
                    $table->dropColumn('slot_type');
                }
                if (Schema::hasColumn('ml_teams', 'slot_count')) {
                    $table->dropColumn('slot_count');
                }
            });
        }
    }
};