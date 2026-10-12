<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PUBGPlayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pubg_team_id' => ['required', 'exists:pubg_teams,id'],
            'team_id' => ['required', 'exists:pubg_teams,id'],

            'pubg_players' => ['required', 'array', 'min:4', 'max:5'],
            'pubg_players.*.name' => ['required', 'string', 'max:255'],
            'pubg_players.*.nickname' => ['required', 'string', 'max:50'],
            'pubg_players.*.id_server' => ['required', 'string', 'max:50'],
            'pubg_players.*.no_hp' => ['required', 'digits_between:10,15'],
            'pubg_players.*.email' => ['required', 'email', 'max:255'],
            'pubg_players.*.alamat' => ['required', 'string', 'min:10'],
            'pubg_players.*.tanda_tangan' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:1024'],
            'pubg_players.*.foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:1024'],
            'pubg_players.*.role' => ['required', 'in:ketua,anggota,cadangan'],
        ];
    }

    public function messages(): array
    {
        return [
            'pubg_team_id.required' => 'ID tim wajib diisi.',
            'pubg_team_id.exists' => 'ID tim tidak ditemukan.',
            'team_id.required' => 'ID tim wajib diisi.',
            'team_id.exists' => 'ID tim tidak ditemukan.',

            'pubg_players.required' => 'Data pemain wajib diisi.',
            'pubg_players.array' => 'Format pemain tidak valid.',
            'pubg_players.min' => 'Minimal harus ada 4 pemain.',
            'pubg_players.max' => 'Maksimal hanya 5 pemain yang diperbolehkan.',

            'pubg_players.*.name.required' => 'Nama pemain wajib diisi.',
            'pubg_players.*.nickname.required' => 'Nickname pemain wajib diisi.',

            'pubg_players.*.id_server.required' => 'ID server wajib diisi.',

            'pubg_players.*.no_hp.required' => 'Nomor HP wajib diisi.',
            'pubg_players.*.no_hp.digits_between' => 'Nomor HP harus terdiri dari 10 hingga 15 digit angka.',

            'pubg_players.*.email.required' => 'Email wajib diisi.',
            'pubg_players.*.email.email' => 'Format email tidak valid.',

            'pubg_players.*.alamat.required' => 'Alamat wajib diisi.',
            'pubg_players.*.alamat.min' => 'Alamat harus minimal 10 karakter.',

            'pubg_players.*.tanda_tangan.image' => 'Tanda tangan harus berupa gambar.',
            'pubg_players.*.tanda_tangan.mimes' => 'Tanda tangan hanya boleh berupa file jpeg, png, atau jpg.',
            'pubg_players.*.tanda_tangan.max' => 'Ukuran tanda tangan maksimal 1MB.',

            'pubg_players.*.foto.image' => 'Foto harus berupa gambar.',
            'pubg_players.*.foto.mimes' => 'Foto hanya boleh berupa file jpeg, png, atau jpg.',
            'pubg_players.*.foto.max' => 'Ukuran foto maksimal 1MB.',

            'pubg_players.*.role.required' => 'Role pemain wajib diisi.',
            'pubg_players.*.role.in' => 'Role hanya boleh diisi dengan ketua, anggota, atau cadangan.',
        ];
    }
}
