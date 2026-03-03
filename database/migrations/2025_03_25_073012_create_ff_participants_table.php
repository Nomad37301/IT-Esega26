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
        Schema::create('ff_participants', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('ff_team_id')->constrained('ff_teams')->onDelete('cascade'); // Kolom ID tim
            $table->string('name'); // Nama peserta
            $table->string('nickname'); // Nickname peserta
            $table->string('id_server'); // ID server peserta
            $table->string('no_hp'); // Nomor HP peserta
            $table->string('email'); // Email peserta
            $table->text('alamat'); // Alamat peserta
            $table->string('tanda_tangan')->nullable(); // Path tanda tangan digital
            $table->string('foto')->nullable(); // Path foto peserta
            $table->enum('role', ['ketua','anggota', 'cadangan'])->default('anggota'); // Role peserta
            $table->timestamps(); // Kolom created_at dan updated_at

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ff_participants');
    }
};
