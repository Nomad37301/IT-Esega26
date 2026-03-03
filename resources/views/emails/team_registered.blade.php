<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Registrasi - {{ $teamName }}</title>
</head>

<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
        <tr>
            <td style="padding: 30px 0;">
                <!-- Container -->
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #c01515; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">IT-ESEGA 2025</h1>
                            <p style="color: #ffe4e4; margin-top: 5px; font-size: 16px;">Information Technology Electronic Sport Based On Excellent Games</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #c01515; font-size: 24px;">🏆 Registrasi Berhasil</h2>
                            <p style="margin: 0 0 15px 0; color: #4a4a4a;">Halo <strong>{{ $email }}</strong>,</p>
                            <p style="margin: 0 0 20px 0; color: #4a4a4a;">Kami dengan senang hati mengkonfirmasi bahwa tim <strong style="color: #c01515;">{{ $teamName }}</strong> telah berhasil terdaftar untuk turnamen <strong style="color: #c01515;">{{ strtoupper($gameType) }}</strong> di IT Essega 2025!</p>
                            
                            <div style="background-color: #fff0f0; border-left: 4px solid #c01515; padding: 15px; margin: 25px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #4a4a4a;">Pastikan untuk melengkapi pendaftaran dengan menambahkan semua anggota ke dalam tim Anda. Langkah ini penting untuk mengkonfirmasi partisipasi Anda dalam turnamen.</p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{ $URL }}" style="background-color: #c01515; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; font-size: 14px; transition: all 0.3s;">
                                    Daftarkan Pemain Anda Sekarang
                                </a>
                            </div>
                            
                            <p style="margin: 20px 0 5px 0; color: #6b6b6b; font-size: 14px;">
                                Jika tombol di atas tidak berfungsi, salin dan tempel URL ini ke browser Anda:
                            </p>
                            <p style="margin: 0; word-break: break-all; font-size: 14px;">
                                <a href="{{ $URL }}" style="color: #c01515; text-decoration: underline;">{{ $URL }}</a>
                            </p>
                            
                            <p style="margin: 30px 0 0 0; color: #4a4a4a;">
                                Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami di <a href="https://wa.me/6287861081640" style="color: #c01515; text-decoration: none; font-weight: bold;">WhatsApp (MITA)-(087861081640)</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Next Steps -->
                    <tr>
                        <td style="background-color: #fff8f8; padding: 25px 30px; border-top: 1px solid #eaeaea;">
                            <h3 style="margin: 0 0 15px 0; color: #c01515; font-size: 18px;">Langkah Selanjutnya</h3>
                            <ul style="margin: 0; padding: 0 0 0 20px; color: #4a4a4a;">
                                <li style="margin-bottom: 8px;">Lengkapi daftar anggota tim Anda</li>
                                <li style="margin-bottom: 8px;">Pantau jadwal turnamen yang akan diumumkan</li>
                                <li style="margin-bottom: 8px;">Ikuti media sosial kami untuk mendapatkan info terbaru</li>
                                <li>Siapkan tim Anda untuk kompetisi!</li>
                            </ul>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #c01515; padding: 25px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px;">
                                Ikuti media sosial kami untuk informasi terbaru
                            </p>
                            <div style="margin-bottom: 20px;">
                                <a href="https://www.instagram.com/it_esega?igsh=ZjdxZDkydnc4NHhx" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-weight: bold;">Instagram</a>
                                <a href="https://www.tiktok.com/@it_esega?_t=ZS-8w0ZWkoxbtQ&_r=1" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-weight: bold;">TikTok</a>
                                <a href="https://youtube.com/@it-esega2756?si=HStpBPZFFp2hjfAV" style="display: inline-block; margin: 0 10px; color: #ffffff; text-decoration: none; font-weight: bold;">YouTube</a>
                            </div>
                            <p style="margin: 0; color: #ffe0e0; font-size: 12px;">
                                © 2025 IT Esega. Seluruh hak cipta dilindungi undang-undang.<br>
                                Ini adalah email otomatis, mohon tidak membalas email ini.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
