<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        $this->call([
            ClusterSeeder::class,
            BranchSeeder::class,
            UserSeeder::class,
            PositionSeeder::class,
            UserProfileSeeder::class,
            // RDSSeeder::class,
        ]);

        $path = base_path() . '/database/seeders/records_disposition_schedules.sql';
        $sql = file_get_contents($path);
        DB::unprepared($sql);
    }
}
