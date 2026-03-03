<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Timeline extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'location',
        'description',
        'due_date',
        'end_date',
        'status',
        'category'
    ];

    protected $casts = [
        'due_date' => 'date',
        'end_date' => 'date',
        'status' => 'boolean',
    ];
}
