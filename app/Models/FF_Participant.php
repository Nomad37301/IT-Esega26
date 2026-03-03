<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class FF_Participant extends Model
{
    use HasFactory;

    protected $table = 'ff_participants'; 
    
    protected $fillable = [
        'ff_team_id', 'name', 'nickname', 'id_server', 'no_hp', 'email', 'alamat',
        'tanda_tangan', 'foto', 'role', 'proof_of_payment', 'status'
    ];

    public function team()
    {
        return $this->belongsTo(FF_Team::class, 'ff_team_id');
    }
    
    /**
     * Bootstrap the model and its traits.
     * Remove associated files when deleting a participant
     */
    protected static function booted()
    {
        static::deleting(function ($participant) {
            // Hapus file foto jika ada
            if ($participant->foto && Storage::disk('public')->exists($participant->foto)) {
                Storage::disk('public')->delete($participant->foto);
            }
            
            // Hapus file tanda tangan jika ada
            if ($participant->tanda_tangan && Storage::disk('public')->exists($participant->tanda_tangan)) {
                Storage::disk('public')->delete($participant->tanda_tangan);
            }
        });
    }
}
