<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\UserPosition;
use App\Models\Position;

class UserProfileIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_have_multiple_positions_with_different_enum_types()
    {
        $user = User::factory()->create(['type' => 'DEV']);
        
        $devPosition = Position::factory()->devType()->create(['name' => 'Developer']);
        $recordsPosition = Position::factory()->recordsCustType()->create(['name' => 'Records Custodian']);
        
        $profile = UserProfile::factory()->create([
            'users_id' => $user->id,
            'positions_id' => $devPosition->id // Main position
        ]);
        
        // Main position
        $mainUserPosition = UserPosition::factory()->mainType()->create([
            'user_profiles_id' => $profile->id,
            'positions_id' => $devPosition->id,
        ]);
        
        // Intervening position
        $interveningUserPosition = UserPosition::factory()->interveningType()->create([
            'user_profiles_id' => $profile->id,
            'positions_id' => $recordsPosition->id,
        ]);
        
        // Verify relationships and enum values
        $this->assertEquals('DEV', $user->type);
        $this->assertEquals('DEV', $profile->position->type);
        $this->assertEquals('MAIN', $mainUserPosition->type);
        $this->assertEquals('INTERVENING', $interveningUserPosition->type);
        $this->assertEquals('RECORDS_CUST', $interveningUserPosition->position->type);
    }

    /** @test */
    public function system_can_filter_users_by_position_type()
    {
        $devUser = User::factory()->create(['type' => 'DEV']);
        $branchHeadUser = User::factory()->create(['type' => 'BRANCH_HEAD']);
        $employeeUser = User::factory()->create(['type' => 'EMPLOYEE']);
        
        $devPosition = Position::factory()->devType()->create();
        $branchHeadPosition = Position::factory()->branchHeadType()->create();
        $employeePosition = Position::factory()->employeeType()->create();
        
        UserProfile::factory()->create(['users_id' => $devUser->id, 'positions_id' => $devPosition->id]);
        UserProfile::factory()->create(['users_id' => $branchHeadUser->id, 'positions_id' => $branchHeadPosition->id]);
        UserProfile::factory()->create(['users_id' => $employeeUser->id, 'positions_id' => $employeePosition->id]);
        
        // Filter users by type
        $devUsers = User::where('type', 'DEV')->get();
        $branchHeadUsers = User::where('type', 'BRANCH_HEAD')->get();
        $employeeUsers = User::where('type', 'EMPLOYEE')->get();
        
        $this->assertCount(1, $devUsers);
        $this->assertCount(1, $branchHeadUsers);
        $this->assertCount(1, $employeeUsers);
        
        $this->assertEquals('DEV', $devUsers->first()->type);
        $this->assertEquals('BRANCH_HEAD', $branchHeadUsers->first()->type);
        $this->assertEquals('EMPLOYEE', $employeeUsers->first()->type);
    }

    /** @test */
    public function system_can_filter_user_positions_by_type()
    {
        $profile = UserProfile::factory()->create();
        
        // Create positions with different types
        $mainPosition = UserPosition::factory()->mainType()->create(['user_profiles_id' => $profile->id]);
        $interveningPosition1 = UserPosition::factory()->interveningType()->create(['user_profiles_id' => $profile->id]);
        $interveningPosition2 = UserPosition::factory()->interveningType()->create(['user_profiles_id' => $profile->id]);
        
        // Filter positions by type
        $mainPositions = $profile->positions->where('type', 'MAIN');
        $interveningPositions = $profile->positions->where('type', 'INTERVENING');
        
        $this->assertCount(1, $mainPositions);
        $this->assertCount(2, $interveningPositions);
        
        $this->assertEquals('MAIN', $mainPositions->first()->type);
        $this->assertEquals('INTERVENING', $interveningPositions->first()->type);
    }
}
