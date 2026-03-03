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
        // Buat tabel ml_teams jika belum ada
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
        
        // Buat tabel ff_teams jika belum ada
        if (!Schema::hasTable('ff_teams')) {
            Schema::create('ff_teams', function (Blueprint $table) {
                $table->id();
                $table->string('team_name')->unique(); // Nama tim
                $table->string('team_logo')->nullable(); // Logo tim
                $table->string('proof_of_payment')->nullable(); // Bukti pembayaran
                $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Status pendaftaran
                $table->timestamps();
            });
        }
        
        // Buat tabel ml_participants jika belum ada
        if (!Schema::hasTable('ml_participants')) {
            Schema::create('ml_participants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ml_team_id')->constrained('ml_teams')->onDelete('cascade');
                $table->string('name'); // Nama asli peserta
                $table->string('nickname'); // Nickname di game
                $table->string('id_server')->nullable(); // ID Server
                $table->string('no_hp'); // Nomor HP
                $table->string('email')->nullable(); // Email
                $table->text('alamat')->nullable(); // Alamat
                $table->string('tanda_tangan')->nullable(); // Tanda tangan (path file)
                $table->string('foto')->nullable(); // Foto peserta (path file)
                $table->string('role')->nullable(); // Role di game
                $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Status pendaftaran
                $table->timestamps();
            });
        }
        
        // Buat tabel ff_participants jika belum ada
        if (!Schema::hasTable('ff_participants')) {
            Schema::create('ff_participants', function (Blueprint $table) {
                $table->id();
                $table->foreignId('ff_team_id')->constrained('ff_teams')->onDelete('cascade');
                $table->string('name'); // Nama asli peserta
                $table->string('nickname'); // Nickname di game
                $table->string('id_server')->nullable(); // ID Server
                $table->string('no_hp'); // Nomor HP
                $table->string('email')->nullable(); // Email
                $table->text('alamat')->nullable(); // Alamat
                $table->string('tanda_tangan')->nullable(); // Tanda tangan (path file)
                $table->string('foto')->nullable(); // Foto peserta (path file)
                $table->string('role')->nullable(); // Role di game
                $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Status pendaftaran
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ml_participants');
        Schema::dropIfExists('ff_participants');
        Schema::dropIfExists('ml_teams');
        Schema::dropIfExists('ff_teams');
    }
};
