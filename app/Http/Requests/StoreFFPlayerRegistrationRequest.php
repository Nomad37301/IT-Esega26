<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFFPlayerRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'id' => 'required|string|max:50',
            'nickname' => 'required|string|max:50',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10',
            'email' => 'required|email',
            'role' => 'required|in:ketua,anggota,cadangan',
            'team_id' => 'required|exists:ff_teams,id',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'name.max' => 'Nama lengkap maksimal 255 karakter.',
            'id.required' => 'Free Fire ID wajib diisi.',
            'id.max' => 'Free Fire ID maksimal 50 karakter.',
            'nickname.required' => 'Nickname wajib diisi.',
            'nickname.max' => 'Nickname maksimal 50 karakter.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'phone.regex' => 'Format nomor telepon tidak valid.',
            'phone.min' => 'Nomor telepon minimal 10 digit.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role yang dipilih tidak valid.',
            'team_id.required' => 'Tim wajib dipilih.',
            'team_id.exists' => 'Tim yang dipilih tidak valid.',
        ];
    }
} 