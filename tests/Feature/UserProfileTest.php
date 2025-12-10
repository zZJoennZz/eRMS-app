<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\Position;
use App\Models\UserPosition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UserProfileTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $profile;
    protected $position;

    protected function setUp(): void
    {
        parent::setUp();

        $this->position = Position::factory()->devType()->create([
            'name' => 'Software Developer',
        ]);
        
        $this->user = User::factory()->create([
            'type' => 'DEV' // Match the position type
        ]);
        
        $this->profile = UserProfile::factory()->create([
            'users_id' => $this->user->id,
            'positions_id' => $this->position->id,
            'first_name' => 'John',
            'middle_name' => 'Michael',
            'last_name' => 'Doe',
            'others' => 'Additional information'
        ]);
    }

    /** @test */
    public function user_profile_can_be_created_with_enum_position_type()
    {
        $this->assertDatabaseHas('user_profiles', [
            'users_id' => $this->user->id,
            'first_name' => 'John',
            'last_name' => 'Doe'
        ]);
        
        $this->assertEquals('DEV', $this->profile->position->type);
    }

    /** @test */
    public function user_profile_can_have_different_position_types()
    {
        $types = ['DEV', 'BRANCH_HEAD', 'RECORDS_CUST', 'WAREHOUSE_CUST', 'EMPLOYEE'];
        
        foreach ($types as $type) {
            $position = Position::factory()->create(['type' => $type]);
            $profile = UserProfile::factory()->create(['positions_id' => $position->id]);
            
            $this->assertEquals($type, $profile->position->type);
        }
    }

    /** @test */
    public function user_profile_can_have_main_and_intervening_positions()
    {
        $mainPosition = UserPosition::factory()->mainType()->create([
            'user_profiles_id' => $this->profile->id
        ]);
        
        $interveningPosition = UserPosition::factory()->interveningType()->create([
            'user_profiles_id' => $this->profile->id
        ]);
        
        $this->assertCount(2, $this->profile->positions);
        $this->assertEquals('MAIN', $mainPosition->type);
        $this->assertEquals('INTERVENING', $interveningPosition->type);
    }

    /** @test */
    public function user_profile_can_retrieve_main_position()
    {
        // Add this method to UserProfile model if needed
        // public function mainPosition()
        // {
        //     return $this->hasOne(UserPosition::class, 'user_profiles_id', 'id')
        //                 ->where('type', 'MAIN');
        // }
        
        $mainPosition = UserPosition::factory()->mainType()->create([
            'user_profiles_id' => $this->profile->id
        ]);
        
        UserPosition::factory()->interveningType()->create([
            'user_profiles_id' => $this->profile->id
        ]);
        
        // If you add the mainPosition relationship
        // $this->assertEquals('MAIN', $this->profile->mainPosition->type);
        
        // Alternative: query through the positions relationship
        $mainPositions = $this->profile->positions->where('type', 'MAIN');
        $this->assertCount(1, $mainPositions);
        $this->assertEquals('MAIN', $mainPositions->first()->type);
    }

    /** @test */
    public function user_profile_can_retrieve_intervening_positions()
    {
        // Add this method to UserProfile model if needed
        // public function interveningPositions()
        // {
        //     return $this->hasMany(UserPosition::class, 'user_profiles_id', 'id')
        //                 ->where('type', 'INTERVENING');
        // }
        
        UserPosition::factory()->mainType()->create([
            'user_profiles_id' => $this->profile->id
        ]);
        
        $interveningPosition1 = UserPosition::factory()->interveningType()->create([
            'user_profiles_id' => $this->profile->id
        ]);
        
        $interveningPosition2 = UserPosition::factory()->interveningType()->create([
            'user_profiles_id' => $this->profile->id
        ]);
        
        // If you add the interveningPositions relationship
        // $this->assertCount(2, $this->profile->interveningPositions);
        
        // Alternative: query through the positions relationship
        $interveningPositions = $this->profile->positions->where('type', 'INTERVENING');
        $this->assertCount(2, $interveningPositions);
        $this->assertEquals('INTERVENING', $interveningPositions->first()->type);
    }
}
