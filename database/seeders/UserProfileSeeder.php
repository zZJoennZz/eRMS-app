<?php

namespace Database\Seeders;

use App\Models\UserProfile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        UserProfile::create([
            'users_id' => 1,
            'first_name' => 'Joenn',
            'middle_name' => '',
            'last_name' => 'Aquilino',
            'others' => '',
            'positions_id' => 1,
        ]);

        UserProfile::create([
            'users_id' => 2,
            'first_name' => 'Test',
            'middle_name' => '',
            'last_name' => 'Test',
            'others' => '',
            'positions_id' => 6,
        ]);

        UserProfile::create([
            'users_id' => 3,
            'first_name' => 'Test 1',
            'middle_name' => '',
            'last_name' => 'Test 1',
            'others' => '',
            'positions_id' => 8,
        ]);

        UserProfile::create([
            'users_id' => 4,
            'first_name' => 'Test 2',
            'middle_name' => '',
            'last_name' => 'Test 2',
            'others' => '',
            'positions_id' => 8,
        ]);

        UserProfile::create([
            'users_id' => 5,
            'first_name' => 'Record',
            'middle_name' => '',
            'last_name' => 'Custodian 1',
            'others' => '',
            'positions_id' => 3,
        ]);

        UserProfile::create([
            'users_id' => 6,
            'first_name' => 'Record',
            'middle_name' => '',
            'last_name' => 'Custodian 2',
            'others' => '',
            'positions_id' => 3,
        ]);

        UserProfile::create([
            'users_id' => 7,
            'first_name' => 'Baliuag',
            'middle_name' => '',
            'last_name' => 'Branch',
            'others' => '',
            'positions_id' => 2,
        ]);
    }
}
