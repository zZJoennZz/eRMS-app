<?php

namespace Database\Seeders;

use App\Models\Cluster;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClusterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Cluster::create(
            [
                "name" => "Bulacan Cluster",
            ]
        );
    }
}
