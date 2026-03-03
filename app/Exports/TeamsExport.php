<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TeamsExport implements FromArray, WithHeadings, WithStyles
{
    protected $teams;

    public function __construct(array $teams)
    {
        $this->teams = $teams;
    }

    public function array(): array
    {
        return $this->teams;
    }

    public function headings(): array
    {
        // Headings for teams
        return [
            'ID',
            'Nama Tim',
            'Game',
            'Jenis Slot',
            'Jumlah Pemain',
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