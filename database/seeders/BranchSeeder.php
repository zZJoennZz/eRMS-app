<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Branch::create([
            'code' => '',
            'name' => 'Warehouse',
            'clusters_id' => 1,
        ]);
        Branch::create([
            'code' => '010',
            'name' => 'Baliuag Branch',
            'clusters_id' => 1,
        ]);
        Branch::create([
            'code' => '011',
            'name' => 'Test 1 Branch',
            'clusters_id' => 1,
        ]);
        Branch::create([
            'code' => '012',
            'name' => 'Test 12 Branch',
            'clusters_id' => 1,
        ]);
        Branch::create([
            'code' => '013',
            'name' => 'Test 13 Branch',
            'clusters_id' => 1,
        ]);
        Branch::create([
            'code' => 'ADMIN',
            'name' => 'ADMIN',
            'clusters_id' => 1,
        ]);
    }
}
