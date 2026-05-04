<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\Exportable;

class FullDatabaseExport implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        $sheets = [];
        $driver = DB::getDriverName();

        // Get all table names based on driver
        if ($driver === 'mysql') {
            $tables = DB::select('SHOW TABLES');
            $dbName = DB::getDatabaseName();
            $key = "Tables_in_{$dbName}";
            $tableNames = array_map(fn($t) => $t->$key, $tables);
        } elseif ($driver === 'sqlite') {
            $tables = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
            $tableNames = array_map(fn($t) => $t->name, $tables);
        } else {
            // Fallback: pgsql or others
            $tableNames = Schema::getConnection()->getDoctrineSchemaManager()->listTableNames();
        }

        // Tables to skip (Laravel internals)
        $skipTables = [
            'password_reset_tokens', 'sessions', 'cache', 'cache_locks',
            'jobs', 'job_batches', 'failed_jobs', 'personal_access_tokens',
        ];

        foreach ($tableNames as $tableName) {
            if (in_array($tableName, $skipTables)) {
                continue;
            }
            $sheets[] = new SingleTableExport($tableName);
        }

        return $sheets;
    }
}
