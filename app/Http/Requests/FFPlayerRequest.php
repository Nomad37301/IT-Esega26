<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FFPlayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ff_team_id' => ['required', 'exists:ff_teams,id'],
            'team_id' => ['required', 'exists:ff_teams,id'],

            'ff_players' => ['required', 'array', 'min:4', 'max:6'],
            'ff_players.*.name' => ['required', 'string', 'max:255'],
            'ff_players.*.nickname' => ['required', 'string', 'max:50'],
            'ff_players.*.id_server' => ['required', 'string', 'max:50'],
            'ff_players.*.no_hp' => ['required', 'digits_between:10,15'],
            'ff_players.*.email' => ['required', 'email', 'max:255'],
            'ff_players.*.alamat' => ['required', 'string', 'min:10'],
            'ff_players.*.tanda_tangan' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:1024'],
            'ff_players.*.foto' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:1024'],
            'ff_players.*.role' => ['required', 'in:ketua,anggota,cadangan'],
        ];
    }

    public function messages(): array
    {
        return [
            'ff_team_id.required' => 'ID tim wajib diisi.',
            'ff_team_id.exists' => 'ID tim tidak ditemukan.',
            'team_id.required' => 'ID tim wajib diisi.',
            'team_id.exists' => 'ID tim tidak ditemukan.',

            'ff_players.required' => 'Data pemain wajib diisi.',
            'ff_players.array' => 'Format pemain tidak valid.',
            'ff_players.min' => 'Minimal harus ada 4 pemain.',
            'ff_players.max' => 'Maksimal hanya 6 pemain yang diperbolehkan.',

            'ff_players.*.name.required' => 'Nama pemain wajib diisi.',
            'ff_players.*.nickname.required' => 'Nickname pemain wajib diisi.',

            'ff_players.*.id_server.required' => 'ID server wajib diisi.',

            'ff_players.*.no_hp.required' => 'Nomor HP wajib diisi.',
            'ff_players.*.no_hp.digits_between' => 'Nomor HP harus terdiri dari 10 hingga 15 digit angka.',

            'ff_players.*.email.required' => 'Email wajib diisi.',
            'ff_players.*.email.email' => 'Format email tidak valid.',

            'ff_players.*.alamat.required' => 'Alamat wajib diisi.',
            'ff_players.*.alamat.min' => 'Alamat harus minimal 10 karakter.',

            'ff_players.*.tanda_tangan.image' => 'Tanda tangan harus berupa gambar.',
            'ff_players.*.tanda_tangan.mimes' => 'Tanda tangan hanya boleh berupa file jpeg, png, atau jpg.',
            'ff_players.*.tanda_tangan.max' => 'Ukuran tanda tangan maksimal 1MB.',

            'ff_players.*.foto.image' => 'Foto harus berupa gambar.',
            'ff_players.*.foto.mimes' => 'Foto hanya boleh berupa file jpeg, png, atau jpg.',
            'ff_players.*.foto.max' => 'Ukuran foto maksimal 1MB.',

            'ff_players.*.role.required' => 'Role pemain wajib diisi.',
            'ff_players.*.role.in' => 'Role hanya boleh diisi dengan ketua, anggota, atau cadangan.',
        ];
    }
}
