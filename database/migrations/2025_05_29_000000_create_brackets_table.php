<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('brackets', function (Blueprint $table) {
            $table->id();
            $table->string('game_name'); // 'ML' or 'FF'
            $table->string('stage_name'); // e.g., 'Qualification Day 1', 'Playoff'
            $table->string('group_name')->nullable(); // e.g., 'Group A', 'Group B'
            $table->string('slug')->unique(); // for easier access in frontend/routing
            $table->text('bracket_url'); // The Challonge URL
            $table->boolean('is_active')->default(true);
            $table->integer('order_position')->default(0); // for sorting
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brackets');
    }
};
