<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Position;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Position>
 */
class PositionFactory extends Factory
{
    protected $model = Position::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['DEV', 'BRANCH_HEAD', 'RECORDS_CUST', 'WAREHOUSE_CUST', 'WAREHOUSE_HEAD', 'EMPLOYEE'];
        return [
            //
            'name' => $this->faker->jobTitle,
            'type' => $this->faker->randomElement($types),
        ];
    }

    // State methods for each type
    public function devType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'DEV',
            ];
        });
    }
    
    public function branchHeadType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'BRANCH_HEAD',
            ];
        });
    }
    
    public function recordsCustType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'RECORDS_CUST',
            ];
        });
    }
    
    public function warehouseCustType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'WAREHOUSE_CUST',
            ];
        });
    }

    public function warehouseHeadType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'WAREHOUSE_HEAD',
            ];
        });
    }
    
    public function employeeType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'EMPLOYEE',
            ];
        });
    }
}
