<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'address' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'KTM' => ['nullable', 'string', 'max:255'],
            'email_verified_at' => ['nullable', 'string', 'max:255'],
            'remember_token' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['required', Rule::in(['active', 'inactive', 'blocked'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.max' => 'Nama maksimal 255 karakter.',

            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan.',
            'email.max' => 'Email maksimal 255 karakter.',

            'address.max' => 'Alamat maksimal 255 karakter.',

            'phone.max' => 'Nomor telepon maksimal 20 karakter.',

            'KTM.max' => 'KTM maksimal 255 karakter.',

            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 8 karakter.',

            'status.required' => 'Status wajib dipilih.',
            'status.in' => 'Status harus salah satu dari: active, inactive, atau blocked.',
        ];
    }
}
