<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMLTeamRegistrationRequest;
use App\Mail\TeamRegistered;
use App\Models\FF_Team;
use App\Models\ML_Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\CompetitionSlot;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TeamRegistrationController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Log untuk debugging
            Log::info('TeamRegistration store method called', [
                'request_data' => $request->except(['team_logo', 'proof_of_payment']),
                'has_team_logo' => $request->hasFile('team_logo'),
                'has_proof_of_payment' => $request->hasFile('proof_of_payment'),
                'all_request_keys' => $request->keys()
            ]);

            $gameType = $request->input('game_type');

            // Coba ambil team_id_to_reuse dari berbagai sumber
            $teamIdToReuse = null;

            // Dari input normal
            if ($request->has('team_id_to_reuse')) {
                $teamIdToReuse = $request->input('team_id_to_reuse');
            }
            // Dari query string
            else if ($request->query('team_id_to_reuse')) {
                $teamIdToReuse = $request->query('team_id_to_reuse');
            }

            // Konversi ke integer jika string dan valid
            if ($teamIdToReuse && is_string($teamIdToReuse) && is_numeric($teamIdToReuse)) {
                $teamIdToReuse = (int) $teamIdToReuse;
            }

            // Log khusus untuk team_id_to_reuse
            Log::info('TeamRegistration team_id_to_reuse detail', [
                'team_id_to_reuse' => $teamIdToReuse,
                'team_id_to_reuse_type' => gettype($teamIdToReuse),
                'has_input' => $request->has('team_id_to_reuse'),
                'query_param' => $request->query('team_id_to_reuse'),
                'uri' => $request->getRequestUri(),
                'method' => $request->method()
            ]);

            // Aturan validasi dasar
            $rules = [
                'team_name' => 'required|string|max:255',
                'team_logo' => 'required|image|max:2048',
                'proof_of_payment' => 'required|image|max:2048',
                'email' => 'required|email|max:255',
                'game_type' => 'required|in:ml,ff',
            ];

            // Tambahkan aturan validasi untuk slot_type jika game-nya Mobile Legends
            if ($gameType === 'ml') {
                $rules['slot_type'] = 'required|in:single,double';
            }

            // Tambahkan validasi unique berdasarkan jenis game
            if ($gameType === 'ml') {
                $rules['team_name'] .= '|unique:ml_teams,team_name';
            } elseif ($gameType === 'ff') {
                $rules['team_name'] .= '|unique:ff_teams,team_name';
            }

            // Buat pesan validasi custom
            $messages = [
                'team_name.required' => 'Nama tim wajib diisi.',
                'team_name.max' => 'Nama tim maksimal 255 karakter.',
                'team_name.unique' => 'Nama tim sudah digunakan. Silakan pilih nama lain.',
                'team_logo.required' => 'Logo tim wajib diunggah.',
                'team_logo.image' => 'Logo tim harus berupa file gambar (jpg, jpeg, png, bmp, gif, svg, atau webp).',
                'team_logo.max' => 'Ukuran logo tim maksimal 2MB.',
                'proof_of_payment.required' => 'Bukti pembayaran wajib diunggah.',
                'proof_of_payment.image' => 'Bukti pembayaran harus berupa file gambar (jpg, jpeg, png, bmp, gif, svg, atau webp).',
                'proof_of_payment.max' => 'Ukuran bukti pembayaran maksimal 2MB.',
                'game_type.required' => 'Jenis game wajib dipilih.',
                'game_type.in' => 'Jenis game tidak valid.',
                'slot_type.required' => 'Tipe slot wajib dipilih.',
                'slot_type.in' => 'Tipe slot tidak valid.',
                'email.required' => 'Email wajib diisi (untuk mengirimkan pemberitahuan).',
                'email.email' => 'Format email tidak valid.',
                'email.max' => 'Email maksimal 255 karakter.',
            ];

            $validated = $request->validate($rules, $messages);

            Log::info('Validation passed', ['validated_data' => $validated, 'teamIdToReuse' => $teamIdToReuse]);

            // Validasi ketersediaan slot berdasarkan game type dan slot type
            $competitionName = $gameType === 'ml' ? 'Mobile Legends' : 'Free Fire';
            $slot = CompetitionSlot::where('competition_name', $competitionName)->first();

            if (!$slot) {
                Log::error('Competition slot not found', ['competition_name' => $competitionName]);
                return response()->json([
                    'success' => false,
                    'message' => "Maaf, kompetisi {$competitionName} tidak ditemukan."
                ], 404);
            }

            // Periksa apakah pengguna memilih double slot
            $isDoubleSlot = false;
            if ($gameType === 'ml') {
                $slotType = $validated['slot_type'] ?? 'single';
                $isDoubleSlot = $slotType === 'double';
            }

            // Hitung jumlah slot yang dibutuhkan berdasarkan tipe slot
            $slotCount = $isDoubleSlot ? 2 : 1;

            // Cek ketersediaan slot
            $availableSlots = $slot->getAvailableSlots();
            if ($availableSlots < $slotCount) {
                Log::error('Insufficient slots', [
                    'available' => $availableSlots,
                    'needed' => $slotCount,
                    'competition' => $competitionName
                ]);
                return response()->json([
                    'success' => false,
                    'message' => "Maaf, slot untuk {$competitionName} sudah penuh. Silakan coba kompetisi lain atau hubungi panitia untuk informasi lebih lanjut."
                ], 400);
            }

            // Pastikan slot masih aktif
            if (!$slot->is_active) {
                Log::error('Competition is not active', [
                    'competition' => $competitionName
                ]);
                return response()->json([
                    'success' => false,
                    'message' => "Maaf, pendaftaran untuk {$competitionName} sudah ditutup."
                ], 400);
            }

            $isML = $validated['game_type'] === 'ml';
            $isFF = $validated['game_type'] === 'ff';

            // Menggunakan transaksi database untuk memastikan semua operasi berjalan dengan baik
            DB::beginTransaction();

            try {
                // Periksa kembali secara manual apakah tim sudah ada (sebagai double-check)
                if ($isML) {
                    $existingTeam = ML_Team::where('team_name', $validated['team_name'])->first();
                    if ($existingTeam) {
                        Log::warning('Team already exists', ['team_name' => $validated['team_name'], 'game_type' => 'ml']);
                        return back()->withErrors(['team_name' => 'Nama tim Mobile Legends sudah digunakan. Silakan gunakan nama lain.'])->withInput();
                    }

                    // Buat tim baru
                    $team = new ML_Team();

                    // Jika ada ID yang ingin digunakan kembali, set ID tersebut
                    if ($teamIdToReuse) {
                        $existingTeamWithId = ML_Team::find($teamIdToReuse);
                        if (!$existingTeamWithId) {
                            // Atur ID secara manual jika ID tersebut tersedia
                            $team->id = $teamIdToReuse;
                            $team->setAttribute('id', $teamIdToReuse); // Memastikan ID diset dengan benar

                            Log::info('Using specified team_id_to_reuse for ML team', [
                                'team_id' => $teamIdToReuse,
                                'team_id_type' => gettype($teamIdToReuse),
                                'team_object' => $team
                            ]);

                            // Cara tambahan: set auto_increment untuk memastikan ID berikutnya lebih tinggi
                            try {
                                DB::statement('ALTER TABLE ml_teams AUTO_INCREMENT = ?', [$teamIdToReuse + 1]);
                                Log::info('Changed ML_Team auto_increment', ['new_value' => $teamIdToReuse + 1]);

                                // Tambahkan pesan ke session untuk ditampilkan di frontend
                                session()->flash('team_id_reused', [
                                    'message' => 'ID tim berhasil digunakan kembali',
                                    'team_id' => $teamIdToReuse,
                                    'game_type' => 'ml'
                                ]);
                            } catch (\Exception $e) {
                                Log::error('Failed to change ML_Team auto_increment', [
                                    'error' => $e->getMessage(),
                                    'team_id' => $teamIdToReuse
                                ]);
                            }
                        } else {
                            Log::warning('Cannot use team_id_to_reuse, team with this ID already exists', [
                                'team_id' => $teamIdToReuse
                            ]);
                        }
                    }

                    // Set slot type dan count untuk ML
                    $team->slot_type = $validated['slot_type'] ?? 'single';
                    $team->slot_count = $isDoubleSlot ? 2 : 1; // Set slot_count sesuai dengan tipe slot

                } else if ($isFF) {
                    $existingTeam = FF_Team::where('team_name', $validated['team_name'])->first();
                    if ($existingTeam) {
                        Log::warning('Team already exists', ['team_name' => $validated['team_name'], 'game_type' => 'ff']);
                        return back()->withErrors(['team_name' => 'Nama tim Free Fire sudah digunakan. Silakan gunakan nama lain.'])->withInput();
                    }

                    // Buat tim baru
                    $team = new FF_Team();

                    // Jika ada ID yang ingin digunakan kembali, set ID tersebut
                    if ($teamIdToReuse) {
                        $existingTeamWithId = FF_Team::find($teamIdToReuse);
                        if (!$existingTeamWithId) {
                            // Atur ID secara manual jika ID tersebut tersedia
                            $team->id = $teamIdToReuse;
                            $team->setAttribute('id', $teamIdToReuse); // Memastikan ID diset dengan benar

                            Log::info('Using specified team_id_to_reuse for FF team', [
                                'team_id' => $teamIdToReuse,
                                'team_id_type' => gettype($teamIdToReuse),
                                'team_object' => $team
                            ]);

                            // Cara tambahan: set auto_increment untuk memastikan ID berikutnya lebih tinggi
                            try {
                                DB::statement('ALTER TABLE ff_teams AUTO_INCREMENT = ?', [$teamIdToReuse + 1]);
                                Log::info('Changed FF_Team auto_increment', ['new_value' => $teamIdToReuse + 1]);

                                // Tambahkan pesan ke session untuk ditampilkan di frontend
                                session()->flash('team_id_reused', [
                                    'message' => 'ID tim berhasil digunakan kembali',
                                    'team_id' => $teamIdToReuse,
                                    'game_type' => 'ff'
                                ]);
                            } catch (\Exception $e) {
                                Log::error('Failed to change FF_Team auto_increment', [
                                    'error' => $e->getMessage(),
                                    'team_id' => $teamIdToReuse
                                ]);
                            }
                        } else {
                            Log::warning('Cannot use team_id_to_reuse for FF, team with this ID already exists', [
                                'team_id' => $teamIdToReuse
                            ]);
                        }
                    }
                    // Free Fire selalu single slot, tidak perlu set slot_type dan slot_count
                }

                $team->team_name = $validated['team_name'];
                $team->email = $validated['email'];

                // Simpan tim untuk mendapatkan/menggunakan ID
                $team->save();

                // Debug log
                Log::info('Team saved', ['team_id' => $team->id, 'team_name' => $team->team_name]);

                // Buat struktur folder berdasarkan ID tim dan nama
                $gameFolder = $isML ? 'ML_teams' : 'FF_teams';
                $teamFolder = $gameFolder . '/' . $team->id . '_' . Str::slug($team->team_name);

                // Buat folder yang diperlukan untuk file tim saja
                if (!Storage::disk('public')->exists($teamFolder)) {
                    Storage::disk('public')->makeDirectory($teamFolder . '/team_logo', 0755, true);
                    Storage::disk('public')->makeDirectory($teamFolder . '/proof_of_payment', 0755, true);
                }

                // Upload logo tim
                if ($request->hasFile('team_logo')) {
                    try {
                        $logoFile = $request->file('team_logo');
                        $logoExtension = $logoFile->getClientOriginalExtension();
                        $logoFileName = Str::slug($team->team_name) . '_logo.' . $logoExtension;
                        $logoPath = $logoFile->storeAs($teamFolder . '/team_logo', $logoFileName, 'public');
                        $team->team_logo = $logoPath;

                        Log::info('Logo uploaded', ['path' => $logoPath]);
                    } catch (\Exception $e) {
                        Log::error('Error uploading logo', ['error' => $e->getMessage()]);
                        throw $e; // Re-throw untuk ditangkap oleh try-catch luar
                    }
                }

                // Upload bukti pembayaran
                if ($request->hasFile('proof_of_payment')) {
                    try {
                        $paymentFile = $request->file('proof_of_payment');
                        $paymentExtension = $paymentFile->getClientOriginalExtension();
                        $paymentFileName = Str::slug($team->team_name) . '_proof.' . $paymentExtension;
                        $paymentPath = $paymentFile->storeAs($teamFolder . '/proof_of_payment', $paymentFileName, 'public');
                        $team->proof_of_payment = $paymentPath;

                        Log::info('Payment proof uploaded', ['path' => $paymentPath]);
                    } catch (\Exception $e) {
                        Log::error('Error uploading payment proof', ['error' => $e->getMessage()]);
                        throw $e; // Re-throw untuk ditangkap oleh try-catch luar
                    }
                }

                // Simpan perubahan pada tim
                $team->save();

                Log::info('Team updated with files', [
                    'team_id' => $team->id,
                    'team_logo' => $team->team_logo,
                    'proof_of_payment' => $team->proof_of_payment
                ]);

                // Setelah berhasil mendaftar, tambah jumlah slot yang digunakan
                // Kurangi slot sesuai dengan jumlah yang dibutuhkan (1 atau 2 tergantung tipe slot)
                $slot->incrementUsedSlots($slotCount);

                // Commit transaksi jika semua operasi berhasil
                DB::commit();

                $encryptedTeamName = encrypt($team->team_name);

                // Pesan sukses yang berbeda tergantung apakah ini double slot atau tidak
                if ($isDoubleSlot) {
                    $successMessage = 'Selamat anda berhasil mendaftar sebagai team ' . $validated['team_name'] . '. Ini adalah tim pertama dari pendaftaran Double Slot. Setelah mengisi data pemain, silakan mendaftar untuk tim kedua Anda.';
                    // Simpan dalam session bahwa pengguna telah mendaftar untuk double slot
                    Session::put('double_slot_registered', true);
                } else {
                    $successMessage = 'Selamat anda berhasil mendaftar sebagai team ' . $validated['team_name'];
                }

                Session::flash('success', $successMessage);

                // dd($team);


                $url = '';
                if ($isML) {
                    $url = route('player-registration.form', ['encryptedTeamName' => $encryptedTeamName]);
                } elseif ($isFF) {
                    $url = route('player-registration-ff.form', ['encryptedTeamName' => $encryptedTeamName]);
                }

                try {
                    Mail::to($team->email)->send(new TeamRegistered(
                        $team->team_name,
                        $gameType,
                        $team->email,
                        $url
                    ));
                } catch (\Exception $e) {
                    // Log the email error but continue with the registration process
                    Log::error('Error sending registration email', [
                        'error' => $e->getMessage(),
                        'team' => $team->team_name,
                        'email' => $team->email
                    ]);
                    // Don't return here, continue to redirect to player registration
                }

                if ($isML) {
                    return redirect()->route('player-registration.form', ['encryptedTeamName' => $encryptedTeamName]);
                } elseif ($isFF) {
                    return redirect()->route('player-registration-ff.form', ['encryptedTeamName' => $encryptedTeamName]);
                }

            } catch (\Exception $e) {
                // Rollback transaksi jika terjadi error
                DB::rollBack();

                Log::error('Error in team registration transaction', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);

                // Hapus folder tim jika sudah dibuat
                if (isset($teamFolder) && Storage::disk('public')->exists($teamFolder)) {
                    Storage::disk('public')->deleteDirectory($teamFolder);
                }

                throw $e; // Re-throw untuk ditangkap oleh try-catch luar
            }

        } catch (\Exception $e) {
            Log::error('Fatal error in team registration', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors(['general' => 'Terjadi kesalahan dalam pendaftaran tim: ' . $e->getMessage()])->withInput();
        }
    }
}

