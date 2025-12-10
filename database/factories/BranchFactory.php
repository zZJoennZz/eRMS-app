<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\Cluster;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Branch>
 */
class BranchFactory extends Factory
{
    protected $model = Branch::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => fake()->unique()->bothify('BR-###??'),
            'name' => fake()->company(),
            'agency_name' => fake()->company(),
            'full_address' => fake()->address(),
            'telephone_number' => fake()->phoneNumber(),
            'email_address' => fake()->unique()->safeEmail(),
            'location_of_records' => 'Branch',
            'others' => 'n/a',
            'clusters_id' => Cluster::factory(),
        ];
    }
}
