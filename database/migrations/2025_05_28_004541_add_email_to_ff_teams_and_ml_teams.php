<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ff_teams', function (Blueprint $table) {
            $table->string('email')->after('team_name')->nullable();
        });

        Schema::table('ml_teams', function (Blueprint $table) {
            $table->string('email')->after('team_name')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('ff_teams', function (Blueprint $table) {
            $table->dropColumn('email');
        });

        Schema::table('ml_teams', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
};
