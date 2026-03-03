<?php

namespace App\Http\Controllers;
use App\Models\FF_Team;
use App\Models\FF_Participant;
use Illuminate\Http\Request;

class FFController extends Controller
{
    public function index(){
        return view('testingForm');
    }

    public function createTeam(Request $request){
        $team = new FF_Team();

        $validator = $request->validate([
            'team_name' => 'required|unique:ff_teams',
            'team_logo' => 'required|mimes:png,jpg,jpeg',
            'proof_of_payment' => 'required|mimes:png,jpg,jpeg',
        ]);

        $team_name = $request->team_name;
        $team_logo = $request->team_logo;
        $proof_of_payment = $request->proof_of_payment;

        $logo_name = $request->team_logo->getClientOriginalName();
        $payment_name = $request->proof_of_payment->getClientOriginalName();
        $request->proof_of_payment->storeAs('payment/FFPayment', $team_name."_".$payment_name);
        $request->team_logo->storeAs('logoTeam/TeamFF', $team_name."_".$logo_name);
        $team->team_name = $request->team_name;
        $team->team_logo = $request->team_logo;
        $team->proof_of_payment = $request->proof_of_payment;
        $team->save();
        $team_name = $team->team_name;
        $team_id = $team->id;

        // Ketua
        $ketua = new FF_Participant();
        $ketua->ff_team_id = $team_id;
        $ketua->name = $request->name;
        $ketua->nickname = $request->nickname;
        $ketua->id_server = $request->id_server;
        $ketua->no_hp = $request->no_hp;
        $ketua->email = $request->email;
        $ketua->alamat = $request->alamat;
        $ketua->tanda_tangan = $request->tanda_tangan;
        $ketua->foto = $request->foto;
        $ketua->role = "ketua";

        $ttd_name = $request->tanda_tangan->getClientOriginalName();
        $foto_name = $request->foto->getClientOriginalName();
        $request->tanda_tangan->storeAs('TandaTangan/FF/'.$team_name, $request->name."_".$ttd_name);
        $request->foto->storeAs('Foto/FF/'.$team_name, $request->name."_".$foto_name);
        $ketua->save();


        // Player 2
        $player2 = new FF_Participant();
        $player2->ff_team_id = $team_id;
        $player2->name = $request->name2;
        $player2->nickname = $request->nickname2;
        $player2->id_server = $request->id_server2;
        $player2->no_hp = $request->no_hp2;
        $player2->email = $request->email2;
        $player2->alamat = $request->alamat2;
        $player2->tanda_tangan = $request->tanda_tangan2;
        $player2->foto = $request->foto2;
        $player2->role = "anggota";

        $ttd_name2 = $request->tanda_tangan2->getClientOriginalName();
        $foto_name2 = $request->foto2->getClientOriginalName();
        $request->tanda_tangan2->storeAs('TandaTangan/FF/'.$team_name, $request->name2."_".$ttd_name2);
        $request->foto2->storeAs('Foto/FF/'.$team_name, $request->name2."_".$foto_name2);
        $player2->save();
        
        // Player 3
        $player3 = new FF_Participant();
        $player3->ff_team_id = $team_id;
        $player3->name = $request->name3;
        $player3->nickname = $request->nickname3;
        $player3->id_server = $request->id_server3;
        $player3->no_hp = $request->no_hp3;
        $player3->email = $request->email3;
        $player3->alamat = $request->alamat3;
        $player3->tanda_tangan = $request->tanda_tangan3;
        $player3->foto = $request->foto3;
        $player3->role = "anggota";

        $ttd_name3 = $request->tanda_tangan3->getClientOriginalName();
        $foto_name3 = $request->foto3->getClientOriginalName();
        $request->tanda_tangan3->storeAs('TandaTangan/FF/'.$team_name, $request->name3."_".$ttd_name3);
        $request->foto3->storeAs('Foto/FF/'.$team_name, $request->name3."_".$foto_name3);
        $player3->save();
        
        // Player 4
        $player4 = new FF_Participant();
        $player4->ff_team_id = $team_id;
        $player4->name = $request->name4;
        $player4->nickname = $request->nickname4;
        $player4->id_server = $request->id_server4;
        $player4->no_hp = $request->no_hp4;
        $player4->email = $request->email4;
        $player4->alamat = $request->alamat4;
        $player4->tanda_tangan = $request->tanda_tangan4;
        $player4->foto = $request->foto4;
        $player4->role = "anggota";

        $ttd_name4 = $request->tanda_tangan4->getClientOriginalName();
        $foto_name4 = $request->foto4->getClientOriginalName();
        $request->tanda_tangan4->storeAs('TandaTangan/FF/'.$team_name, $request->name4."_".$ttd_name4);
        $request->foto4->storeAs('Foto/FF/'.$team_name, $request->name4."_".$foto_name4);
        $player4->save();
        
        return redirect('/');
    }
}
