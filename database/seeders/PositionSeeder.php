<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $names = [
            "Branch Service Officer",
            "Branch Operations Officer",
            "Teller",
            "Document Examiner",
            "New Accounts",
            "Executive Assistant",
            "Clearing",
            "Salary Loans",
            "ATM Bookkeeper",
            "ATM Teller",
            "CASA Bookkeeper",
            "SL Bookkeeper",
            "Verifier",
        ];
        Position::create(
            [
                "name" => "Web Developer",
                "type" => "DEV"
            ]
        );
        Position::create(
            [
                "name" => "Branch Head",
                "type" => "BRANCH_HEAD"
            ]
        );
        Position::create(
            [
                "name" => "Records Custodian",
                "type" => "RECORDS_CUST"
            ]
        );
        Position::create(
            [
                "name" => "Warehouse Custodian",
                "type" => "WAREHOUSE_CUST"
            ]
        );
        foreach ($names as $n) {
            Position::create(
                [
                    "name" => $n,
                    "type" => "EMPLOYEE"
                ]
            );
        }
    }
}
