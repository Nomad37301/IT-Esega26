<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFFTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'team_name' => 'required|string|unique:ff_teams,team_name',
            'team_logo' => 'nullable|image|max:2048',
            'proof_of_payment' => 'nullable|image|max:2048',
            'status' => 'in:pending,verified,rejected',
        ];
    }

    public function messages(): array
    {
        return [
            'team_name.required' => 'Nama tim wajib diisi.',
            'team_name.string' => 'Nama tim harus berupa teks.',
            'team_name.unique' => 'Nama tim sudah digunakan, silakan pilih nama lain.',

            'team_logo.image' => 'Logo tim harus berupa gambar.',
            'team_logo.max' => 'Ukuran logo maksimal 2MB.',

            'proof_of_payment.image' => 'Bukti pembayaran harus berupa gambar.',
            'proof_of_payment.max' => 'Ukuran bukti pembayaran maksimal 2MB.',

            'status.in' => 'Status harus berupa: pending, verified, atau rejected.',
        ];
    }
}
