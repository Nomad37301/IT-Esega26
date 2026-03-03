<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePlayerMLRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_id' => 'required|exists:ml_teams,id',
            'ml_players' => 'array',
            'ml_players.*.name' => 'required|string',
            'ml_players.*.nickname' => 'required|string',
            'ml_players.*.id_server' => 'required|string',
            'ml_players.*.no_hp' => 'required|string',
            'ml_players.*.email' => 'required|email',
            'ml_players.*.alamat' => 'nullable|string',
            'ml_players.*.tanda_tangan' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
            'ml_players.*.foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1024',
            'ml_players.*.role' => 'required|string|in:ketua,anggota,cadangan',
        ];
    }

    public function messages(): array
    {
        return [
            'team_id.required' => 'Tim wajib dipilih.',
            'team_id.exists' => 'Tim tidak ditemukan.',
            'ml_players.array' => 'Data pemain ML harus berupa array.',
            'ml_players.*.name.required' => 'Nama pemain ML wajib diisi.',
            'ml_players.*.nickname.required' => 'Nickname pemain ML wajib diisi.',
            'ml_players.*.id_server.required' => 'ID server pemain ML wajib diisi.',
            'ml_players.*.no_hp.required' => 'No HP pemain ML wajib diisi.',
            'ml_players.*.email.required' => 'Email pemain ML wajib diisi.',
            'ml_players.*.email.email' => 'Format email pemain ML tidak valid.',
            'ml_players.*.alamat.string' => 'Alamat pemain ML harus berupa string.',
            'ml_players.*.tanda_tangan.image' => 'Tanda tangan harus berupa file Image, Coba Upload Ulang Tanda Tangan anda.',
            'ml_players.*.tanda_tangan.mimes' => 'Tanda tangan harus berupa file JPG atau PNG.',
            'ml_players.*.tanda_tangan.max' => 'Ukuran file tanda tangan tidak boleh lebih dari 1MB.',
            'ml_players.*.foto.image' => 'Foto harus berupa file Image, Coba Upload Ulang foto anda.',
            'ml_players.*.foto.mimes' => 'Foto harus berupa file JPG atau PNG.',
            'ml_players.*.foto.max' => 'Ukuran file foto tidak boleh lebih dari 1MB.',
            'ml_players.*.role.required' => 'Role pemain ML wajib diisi.',
            'ml_players.*.role.in' => 'Role pemain ML tidak valid.',
        ];
    }
}

