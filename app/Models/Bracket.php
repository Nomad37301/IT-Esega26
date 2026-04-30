<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bracket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'game_name',
        'stage_name',
        'group_name',
        'slug',
        'bracket_url',
        'is_active',
        'order_position',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order_position' => 'integer',
    ];
}
