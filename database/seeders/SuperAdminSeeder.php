<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin IT Esega',
            'email' => 'itesega2025@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('TIsegasuperAdmin2025'),
            'remember_token' => Str::random(10)
        ])->assignRole('super_admin');
    }
}

