<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFFTeamRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_name' => 'required|string|unique:ff_teams,team_name',
            'team_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'proof_of_payment' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'game_type' => 'required|in:ff',
        ];
    }

    public function messages(): array
    {
        return [
            'team_name.required' => 'Nama tim wajib diisi.',
            'team_name.unique' => 'Nama tim sudah terdaftar, silahkan pilih nama lain.',
            'team_logo.image' => 'Logo tim harus berupa gambar.',
            'team_logo.mimes' => 'Logo tim harus berformat jpeg, png, jpg, atau gif.',
            'team_logo.max' => 'Logo tim maksimal 2MB.',
            'proof_of_payment.image' => 'Bukti pembayaran harus berupa gambar.',
            'proof_of_payment.mimes' => 'Bukti pembayaran harus berformat jpeg, png, jpg, atau gif.',
            'proof_of_payment.max' => 'Bukti pembayaran maksimal 2MB.',
            'game_type.required' => 'Jenis game wajib dipilih.',
            'game_type.in' => 'Jenis game yang dipilih tidak valid.',
        ];
    }
} 