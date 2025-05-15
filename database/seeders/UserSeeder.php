<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::create([
            'branches_id' => Branch::where('code', 'ADMIN')->first()->id,
            'type' => 'DEV',
            'username' => "webdev",
            'email' => "zzjoennzz@gmail.com",
            'password' => bcrypt("pokemon14"),
        ]);

        User::create([
            'branches_id' => 2,
            'type' => 'EMPLOYEE',
            'username' => "test1",
            'email' => "test1@gmail.com",
            'password' => bcrypt("test1"),
        ]);

        User::create([
            'branches_id' => 2,
            'type' => 'EMPLOYEE',
            'username' => "test2",
            'email' => "test2@gmail.com",
            'password' => bcrypt("test2"),
        ]);

        User::create([
            'branches_id' => 3,
            'type' => 'EMPLOYEE',
            'username' => "test3",
            'email' => "test3@gmail.com",
            'password' => bcrypt("test3"),
        ]);

        User::create([
            'branches_id' => 2,
            'type' => 'RECORDS_CUST',
            'username' => "record_cust1",
            'email' => "record_cust@gmail.com",
            'password' => bcrypt("test123"),
        ]);

        User::create([
            'branches_id' => 3,
            'type' => 'RECORDS_CUST',
            'username' => "record_cust2",
            'email' => "record_cust2@gmail.com",
            'password' => bcrypt("test123"),
        ]);

        User::create([
            'branches_id' => 2,
            'type' => 'BRANCH_HEAD',
            'username' => "baliuaghead",
            'email' => "baliuaghead@gmail.com",
            'password' => bcrypt("test123"),
        ]);
        User::create([
            'branches_id' => 1,
            'type' => 'WAREHOUSE_CUST',
            'username' => "wh1_cust",
            'email' => "wh1_cust@gmail.com",
            'password' => bcrypt("test123"),
        ]);
    }
}
