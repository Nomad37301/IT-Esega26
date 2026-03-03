<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AllPlayersExport implements FromArray, WithHeadings, WithStyles, ShouldAutoSize
{
    protected $players;

    public function __construct(array $players)
    {
        $this->players = $players;
    }

    public function array(): array
    {
        return $this->players;
    }

    public function headings(): array
    {
        // Default headers
        return [
            'ID',
            'Nama',
            'Nickname',
            'ID Server',
            'No. HP',
            'Email',
            'Alamat',
            'Role',
            'Tim',
            'Game',
            'Status',
            'Tanggal Daftar',
            'Terakhir Diperbarui'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Styling header row
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'color' => ['argb' => 'FF4F81BD']
                ],
                'font' => [
                    'color' => ['argb' => 'FFFFFFFF'],
                    'bold' => true,
                ]
            ],
        ];
    }
} 