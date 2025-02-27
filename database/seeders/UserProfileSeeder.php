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
            'first_name' => 'Eien',
            'middle_name' => '',
            'last_name' => 'Dev',
            'others' => '',
            'positions_id' => 1,
        ]);

        UserProfile::create([
            'users_id' => 2,
            'first_name' => 'Dylan',
            'middle_name' => '',
            'last_name' => 'Bennett',
            'others' => '',
            'positions_id' => 6,
        ]);

        UserProfile::create([
            'users_id' => 3,
            'first_name' => 'Leonardo',
            'middle_name' => '',
            'last_name' => 'Willis',
            'others' => '',
            'positions_id' => 8,
        ]);

        UserProfile::create([
            'users_id' => 4,
            'first_name' => 'Alexa',
            'middle_name' => '',
            'last_name' => 'Chen',
            'others' => '',
            'positions_id' => 8,
        ]);

        UserProfile::create([
            'users_id' => 5,
            'first_name' => 'Miranda',
            'middle_name' => '',
            'last_name' => 'Ahmed',
            'others' => '',
            'positions_id' => 3,
        ]);

        UserProfile::create([
            'users_id' => 6,
            'first_name' => 'Patrick',
            'middle_name' => '',
            'last_name' => 'Powell',
            'others' => '',
            'positions_id' => 3,
        ]);

        UserProfile::create([
            'users_id' => 7,
            'first_name' => 'Vivian',
            'middle_name' => '',
            'last_name' => 'Dickson',
            'others' => '',
            'positions_id' => 2,
        ]);

        UserProfile::create([
            'users_id' => 8,
            'first_name' => 'Ari',
            'middle_name' => '',
            'last_name' => 'Mann',
            'others' => '',
            'positions_id' => 4,
        ]);
    }
}
