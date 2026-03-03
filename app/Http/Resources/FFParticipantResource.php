<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FFParticipantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ff_team_id' => $this->ff_team_id,
            'name' => $this->name,
            'nickname' => $this->nickname,
            'id_server' => $this->id_server,
            'no_hp' => $this->no_hp,
            'email' => $this->email,
            'alamat' => $this->alamat,
            'tanda_tangan' => $this->tanda_tangan,
            'foto' => $this->foto,
            'role' => $this->role,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
