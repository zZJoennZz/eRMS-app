<?php

namespace Database\Seeders;

use App\Models\InterveningRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InterveningRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $roles = [
            'Supplies Officer',
            'Property Officer',
            'Time Keeper',
            'Lars',
            'Records Management Officer',
        ];

        foreach ($roles as $r) {
            InterveningRole::create(
                [
                    "name" => $r,
                ]
            );
        }
    }
}
