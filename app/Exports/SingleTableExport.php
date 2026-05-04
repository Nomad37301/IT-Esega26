<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SingleTableExport implements FromCollection, WithTitle, WithHeadings, WithStyles, ShouldAutoSize
{
    protected string $tableName;
    protected array $columns;

    public function __construct(string $tableName)
    {
        $this->tableName = $tableName;
        $this->columns = [];
    }

    public function collection()
    {
        $data = DB::table($this->tableName)->get();

        // Store column names from the first row
        if ($data->isNotEmpty()) {
            $this->columns = array_keys((array) $data->first());
        } else {
            // If table is empty, get columns from schema
            $this->columns = DB::getSchemaBuilder()->getColumnListing($this->tableName);
        }

        // Convert each row to array values only
        return $data->map(function ($row) {
            return collect((array) $row)->values();
        });
    }

    public function headings(): array
    {
        // If columns haven't been populated yet (collection() not called), fetch them
        if (empty($this->columns)) {
            $first = DB::table($this->tableName)->first();
            if ($first) {
                $this->columns = array_keys((array) $first);
            } else {
                $this->columns = DB::getSchemaBuilder()->getColumnListing($this->tableName);
            }
        }

        return $this->columns;
    }

    public function title(): string
    {
        // Excel sheet names max 31 chars
        return substr($this->tableName, 0, 31);
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['argb' => 'FFFFFFFF'],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'color' => ['argb' => 'FF4D7A8C'],
                ],
            ],
        ];
    }
}
