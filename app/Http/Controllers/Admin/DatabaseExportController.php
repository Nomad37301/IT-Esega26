<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Exports\FullDatabaseExport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DatabaseExportController extends Controller
{
    /**
     * Export seluruh database (Excel) + semua file upload sebagai ZIP.
     * Menggunakan PHP native ZipArchive dengan fallback ke tar/manual approach.
     */
    public function exportAll()
    {
        $timestamp = now()->format('Y-m-d_His');

        // Pastikan folder temp ada
        $tempDir = storage_path('app/temp');
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        // 1. Generate Excel database export
        $excelFileName = "database-{$timestamp}.xlsx";
        Excel::store(new FullDatabaseExport(), "temp/{$excelFileName}", 'local');
        $excelTempPath = storage_path("app/temp/{$excelFileName}");

        // 2. Kumpulkan semua file yang akan di-zip
        $files = [];

        // Tambahkan file Excel
        $files[] = [
            'path' => $excelTempPath,
            'zipPath' => "database/{$excelFileName}",
        ];

        // Tambahkan file upload
        $uploadDirs = ['ML_teams', 'PUBG_teams'];
        foreach ($uploadDirs as $dir) {
            $basePath = storage_path("app/public/{$dir}");
            if (is_dir($basePath)) {
                $this->collectFiles($basePath, "uploads/{$dir}", $files);
            }
        }

        // Cek folder legacy
        $legacyDirs = ['payment', 'logoTeam', 'TandaTangan', 'Foto'];
        foreach ($legacyDirs as $dir) {
            foreach ([storage_path("app/{$dir}"), storage_path("app/public/{$dir}")] as $path) {
                if (is_dir($path)) {
                    $this->collectFiles($path, "uploads/{$dir}", $files);
                }
            }
        }

        // 3. Buat ZIP menggunakan ZipArchive jika tersedia, atau fallback ke manual
        $zipFileName = "IT-ESEGA-Full-Export-{$timestamp}.zip";
        $zipPath = storage_path("app/temp/{$zipFileName}");

        if (class_exists('ZipArchive')) {
            $this->createZipWithZipArchive($zipPath, $files);
        } else {
            // Fallback: buat ZIP secara manual menggunakan PHP streams
            $this->createZipManual($zipPath, $files);
        }

        // Cleanup Excel temp file
        if (file_exists($excelTempPath)) {
            @unlink($excelTempPath);
        }

        return response()->download($zipPath, $zipFileName)->deleteFileAfterSend(true);
    }

    /**
     * Buat ZIP menggunakan ZipArchive (jika extension tersedia).
     */
    private function createZipWithZipArchive(string $zipPath, array $files): void
    {
        $zip = new \ZipArchive();
        $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

        foreach ($files as $file) {
            $zip->addFile($file['path'], $file['zipPath']);
        }

        $zip->close();
    }

    /**
     * Buat ZIP secara manual tanpa ext-zip.
     * Format ZIP sederhana yang kompatibel dengan semua unzipper.
     */
    private function createZipManual(string $zipPath, array $files): void
    {
        $fp = fopen($zipPath, 'wb');

        $centralDirectory = '';
        $offset = 0;
        $fileCount = 0;

        foreach ($files as $file) {
            if (!file_exists($file['path'])) {
                continue;
            }

            $data = file_get_contents($file['path']);
            $name = str_replace('\\', '/', $file['zipPath']);

            $crc32 = crc32($data);
            $compressedSize = strlen($data);
            $uncompressedSize = strlen($data);
            $nameLen = strlen($name);

            $dosTime = $this->toDosTime(filemtime($file['path']));

            // Local file header
            $localHeader = "\x50\x4b\x03\x04"; // Signature
            $localHeader .= "\x14\x00";         // Version needed (2.0)
            $localHeader .= "\x00\x00";         // General purpose bit flag
            $localHeader .= "\x00\x00";         // Compression method (stored)
            $localHeader .= pack('V', $dosTime); // Last mod file time + date
            $localHeader .= pack('V', $crc32);
            $localHeader .= pack('V', $compressedSize);
            $localHeader .= pack('V', $uncompressedSize);
            $localHeader .= pack('v', $nameLen);
            $localHeader .= pack('v', 0);       // Extra field length

            fwrite($fp, $localHeader);
            fwrite($fp, $name);
            fwrite($fp, $data);

            $localHeaderLen = strlen($localHeader) + $nameLen + $compressedSize;

            // Central directory entry
            $cdEntry = "\x50\x4b\x01\x02";     // Signature
            $cdEntry .= "\x14\x00";             // Version made by
            $cdEntry .= "\x14\x00";             // Version needed
            $cdEntry .= "\x00\x00";             // Flags
            $cdEntry .= "\x00\x00";             // Compression
            $cdEntry .= pack('V', $dosTime);
            $cdEntry .= pack('V', $crc32);
            $cdEntry .= pack('V', $compressedSize);
            $cdEntry .= pack('V', $uncompressedSize);
            $cdEntry .= pack('v', $nameLen);
            $cdEntry .= pack('v', 0);           // Extra field length
            $cdEntry .= pack('v', 0);           // File comment length
            $cdEntry .= pack('v', 0);           // Disk number start
            $cdEntry .= pack('v', 0);           // Internal file attributes
            $cdEntry .= pack('V', 32);          // External file attributes
            $cdEntry .= pack('V', $offset);     // Relative offset
            $cdEntry .= $name;

            $centralDirectory .= $cdEntry;
            $offset += $localHeaderLen;
            $fileCount++;
        }

        // Write central directory
        $cdOffset = $offset;
        fwrite($fp, $centralDirectory);
        $cdSize = strlen($centralDirectory);

        // End of central directory record
        $eocd = "\x50\x4b\x05\x06";            // Signature
        $eocd .= pack('v', 0);                  // Disk number
        $eocd .= pack('v', 0);                  // Disk with central dir
        $eocd .= pack('v', $fileCount);          // Entries on this disk
        $eocd .= pack('v', $fileCount);          // Total entries
        $eocd .= pack('V', $cdSize);             // Central dir size
        $eocd .= pack('V', $cdOffset);           // Central dir offset
        $eocd .= pack('v', 0);                  // Comment length

        fwrite($fp, $eocd);
        fclose($fp);
    }

    /**
     * Convert Unix timestamp ke DOS time format.
     */
    private function toDosTime(int $timestamp): int
    {
        $d = getdate($timestamp);
        return (($d['year'] - 1980) << 25)
            | ($d['mon'] << 21)
            | ($d['mday'] << 16)
            | ($d['hours'] << 11)
            | ($d['minutes'] << 5)
            | ($d['seconds'] >> 1);
    }

    /**
     * Rekursif mengumpulkan file dari direktori.
     */
    private function collectFiles(string $dirPath, string $zipFolder, array &$files): void
    {
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dirPath, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($iterator as $file) {
            if ($file->isFile()) {
                $filePath = $file->getRealPath();
                $relativePath = $zipFolder . '/' . substr($filePath, strlen($dirPath) + 1);
                $relativePath = str_replace('\\', '/', $relativePath);
                $files[] = [
                    'path' => $filePath,
                    'zipPath' => $relativePath,
                ];
            }
        }
    }
}
