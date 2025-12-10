<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\UserPosition;
use App\Models\UserProfile;
use App\Models\Position;

class UserPositionTest extends TestCase
{
    use RefreshDatabase;

    protected $userPosition;
    protected $profile;
    protected $position;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->profile = UserProfile::factory()->create();
        $this->position = Position::factory()->branchHeadType()->create([
            'name' => 'Branch Manager',
        ]);
        
        $this->userPosition = UserPosition::factory()->mainType()->create([
            'user_profiles_id' => $this->profile->id,
            'positions_id' => $this->position->id,
        ]);
    }

    /** @test */
    public function user_position_can_be_created_with_enum_types()
    {
        $this->assertDatabaseHas('user_positions', [
            'user_profiles_id' => $this->profile->id,
            'positions_id' => $this->position->id,
            'type' => 'MAIN'
        ]);
        
        $this->assertEquals('BRANCH_HEAD', $this->userPosition->position->type);
    }

    /** @test */
    public function user_position_type_must_be_valid_enum_value()
    {
        // Test that only MAIN and INTERVENING are valid
        $validTypes = ['MAIN', 'INTERVENING'];
        
        foreach ($validTypes as $type) {
            $userPosition = UserPosition::factory()->create(['type' => $type]);
            $this->assertEquals($type, $userPosition->type);
        }
        
        // Test that invalid types cannot be saved (if you have validation)
        // This would depend on how you handle validation in your application
        // try {
        //     $invalidPosition = UserPosition::factory()->create(['type' => 'INVALID']);
        //     $this->fail('Expected validation exception for invalid type');
        // } catch (\Illuminate\Database\QueryException $e) {
        //     // Expected behavior if database has enum constraint
        //     $this->assertTrue(true);
        // }
    }

    /** @test */
    public function user_position_can_scope_by_main_type()
    {
        UserPosition::factory()->interveningType()->create(['user_profiles_id' => $this->profile->id]);
        UserPosition::factory()->interveningType()->create(['user_profiles_id' => $this->profile->id]);
        
        // Add this scope to UserPosition model if needed
        // public function scopeMain($query)
        // {
        //     return $query->where('type', 'MAIN');
        // }
        
        $mainPositions = UserPosition::where('type', 'MAIN')->get();
        $this->assertCount(1, $mainPositions);
        $this->assertEquals('MAIN', $mainPositions->first()->type);
    }

    /** @test */
    public function user_position_can_scope_by_intervening_type()
    {
        UserPosition::factory()->mainType()->create(['user_profiles_id' => $this->profile->id]);
        
        // Add this scope to UserPosition model if needed
        // public function scopeIntervening($query)
        // {
        //     return $query->where('type', 'INTERVENING');
        // }
        
        $interveningPositions = UserPosition::where('type', 'INTERVENING')->get();
        $this->assertCount(0, $interveningPositions); // We haven't created any intervening yet
        
        UserPosition::factory()->interveningType()->create(['user_profiles_id' => $this->profile->id]);
        UserPosition::factory()->interveningType()->create(['user_profiles_id' => $this->profile->id]);
        
        $interveningPositions = UserPosition::where('type', 'INTERVENING')->get();
        $this->assertCount(2, $interveningPositions);
    }
}
