<?php

namespace Database\Seeders;

use App\Models\UserPosition;
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
        UserPosition::create([
            'user_profiles_id' => 1,
            'positions_id' => 1,
            'type' => "MAIN",
        ]);

        UserProfile::create([
            'users_id' => 2,
            'first_name' => 'Dylan',
            'middle_name' => '',
            'last_name' => 'Bennett',
            'others' => '',
            'positions_id' => 6,
        ]);
        UserPosition::create([
            'user_profiles_id' => 2,
            'positions_id' => 9,
            'type' => "MAIN",
        ]);

        UserProfile::create([
            'users_id' => 3,
            'first_name' => 'Leonardo',
            'middle_name' => '',
            'last_name' => 'Willis',
            'others' => '',
            'positions_id' => 8,
        ]);
        UserPosition::create([
            'user_profiles_id' => 3,
            'positions_id' => 8,
            'type' => "MAIN",
        ]);

        UserProfile::create([
            'users_id' => 4,
            'first_name' => 'Alexa',
            'middle_name' => '',
            'last_name' => 'Chen',
            'others' => '',
            'positions_id' => 8,
        ]);
        UserPosition::create([
            'user_profiles_id' => 4,
            'positions_id' => 8,
            'type' => "MAIN",
        ]);

        UserProfile::create([
            'users_id' => 5,
            'first_name' => 'Miranda',
            'middle_name' => '',
            'last_name' => 'Ahmed',
            'others' => '',
            'positions_id' => 3,
        ]);
        UserPosition::create([
            'user_profiles_id' => 5,
            'positions_id' => 3,
            'type' => "MAIN",
        ]);

        UserProfile::create([
            'users_id' => 6,
            'first_name' => 'Patrick',
            'middle_name' => '',
            'last_name' => 'Powell',
            'others' => '',
            'positions_id' => 3,
        ]);
        UserPosition::create([
            'user_profiles_id' => 6,
            'positions_id' => 3,
            'type' => "MAIN",
        ]);

        UserProfile::create([
            'users_id' => 7,
            'first_name' => 'Vivian',
            'middle_name' => '',
            'last_name' => 'Dickson',
            'others' => '',
            'positions_id' => 2,
        ]);
        UserPosition::create([
            'user_profiles_id' => 7,
            'positions_id' => 2,
            'type' => "MAIN",
        ]);

        UserProfile::create([
            'users_id' => 8,
            'first_name' => 'Ari',
            'middle_name' => '',
            'last_name' => 'Mann',
            'others' => '',
            'positions_id' => 4,
        ]);
        UserPosition::create([
            'user_profiles_id' => 8,
            'positions_id' => 4,
            'type' => "MAIN",
        ]);
    }
}
