<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserPosition;
use App\Models\UserProfile;
use App\Models\Position;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserPosition>
 */
class UserPositionFactory extends Factory
{
    protected $model = UserPosition::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_profiles_id' => UserProfile::factory(),
            'positions_id' => Position::factory(),
            'type' => $this->faker->randomElement(['MAIN', 'INTERVENING']),
        ];
    }

    // State methods for each type
    public function mainType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'MAIN',
            ];
        });
    }
    
    public function interveningType()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'INTERVENING',
            ];
        });
    }
}
