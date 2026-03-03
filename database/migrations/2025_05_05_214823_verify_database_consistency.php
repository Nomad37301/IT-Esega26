<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Log untuk debugging migrasi
        Log::info('Running verify_database_consistency migration');

        try {
            // Memperbaiki tabel ml_teams jika ada masalah
            if (Schema::hasTable('ML_Team')) {
                Log::warning('Found inconsistent table name: ML_Team, renaming to ml_teams');
                DB::statement('RENAME TABLE `ML_Team` TO `ml_teams`');
            }

            if (!Schema::hasTable('ml_teams')) {
                Log::info('Creating ml_teams table');
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
            } else {
                // Verifikasi kolom yang diperlukan untuk ml_teams
                if (!Schema::hasColumn('ml_teams', 'slot_type')) {
                    Schema::table('ml_teams', function (Blueprint $table) {
                        $table->string('slot_type')->default('double')->after('team_name');
                    });
                }
                
                if (!Schema::hasColumn('ml_teams', 'slot_count')) {
                    Schema::table('ml_teams', function (Blueprint $table) {
                        $table->integer('slot_count')->default(2)->after('slot_type');
                    });
                }
            }

            // Memperbaiki tabel ff_teams jika ada masalah
            if (Schema::hasTable('FF_Team')) {
                Log::warning('Found inconsistent table name: FF_Team, renaming to ff_teams');
                DB::statement('RENAME TABLE `FF_Team` TO `ff_teams`');
            }

            if (!Schema::hasTable('ff_teams')) {
                Log::info('Creating ff_teams table');
                Schema::create('ff_teams', function (Blueprint $table) {
                    $table->id();
                    $table->string('team_name')->unique(); // Nama tim
                    $table->string('team_logo')->nullable(); // Logo tim
                    $table->string('proof_of_payment')->nullable(); // Bukti pembayaran
                    $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Status pendaftaran
                    $table->timestamps();
                });
            }

            // Memperbaiki tabel ml_participants jika ada masalah
            if (Schema::hasTable('ML_Participant')) {
                Log::warning('Found inconsistent table name: ML_Participant, renaming to ml_participants');
                DB::statement('RENAME TABLE `ML_Participant` TO `ml_participants`');
            }

            if (!Schema::hasTable('ml_participants')) {
                Log::info('Creating ml_participants table');
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
                    $table->enum('role', ['ketua', 'anggota', 'cadangan'])->default('anggota'); // Role di game
                    $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Status pendaftaran
                    $table->timestamps();
                });
            }

            // Memperbaiki tabel ff_participants jika ada masalah
            if (Schema::hasTable('FF_Participant')) {
                Log::warning('Found inconsistent table name: FF_Participant, renaming to ff_participants');
                DB::statement('RENAME TABLE `FF_Participant` TO `ff_participants`');
            }

            if (!Schema::hasTable('ff_participants')) {
                Log::info('Creating ff_participants table');
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
                    $table->enum('role', ['ketua', 'anggota', 'cadangan'])->default('anggota'); // Role di game
                    $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending'); // Status pendaftaran
                    $table->timestamps();
                });
            }
            
            // Tambahkan kolom status jika belum ada di table ml_participants atau ff_participants
            if (Schema::hasTable('ml_participants') && !Schema::hasColumn('ml_participants', 'status')) {
                Schema::table('ml_participants', function (Blueprint $table) {
                    $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
                });
            }
            
            if (Schema::hasTable('ff_participants') && !Schema::hasColumn('ff_participants', 'status')) {
                Schema::table('ff_participants', function (Blueprint $table) {
                    $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
                });
            }
            
            Log::info('Database consistency verification completed successfully');
        } catch (\Exception $e) {
            Log::error('Error in database consistency verification: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Tidak perlu melakukan apa-apa ketika rollback
        // karena ini hanya migrasi perbaikan konsistensi
    }
};
