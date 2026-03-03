<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimelineRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'status' => ['required', 'boolean'],
            'category' => ['required', 'in:mobile_legend,free_fire,valorant,pubgm,opening,closing'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul wajib diisi.',
            'title.string' => 'Judul harus berupa teks.',
            'title.max' => 'Judul tidak boleh lebih dari 255 karakter.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi tidak boleh lebih dari 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'due_date.date' => 'Tanggal harus berupa format tanggal yang valid.',
            'end_date.date' => 'Tanggal harus berupa format tanggal yang valid.',
            'status.required' => 'Status wajib diisi.',
            'status.boolean' => 'Status harus berupa true atau false.',
            'category.required' => 'Kategori wajib dipilih.',
            'category.in' => 'Kategori yang dipilih tidak valid. Pilih antara mobile legend, free fire, valorant, pubgm, opening atau closing.',
        ];
    }
}
