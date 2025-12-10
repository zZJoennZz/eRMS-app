<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Position;
use App\Models\UserProfile;

class PositionTest extends TestCase
{
    use RefreshDatabase;

    protected $position;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->position = Position::factory()->recordsCustType()->create([
            'name' => 'Records Custodian',
        ]);
    }

    /** @test */
    public function position_can_be_created_with_enum_type()
    {
        $this->assertDatabaseHas('positions', [
            'name' => 'Records Custodian',
            'type' => 'RECORDS_CUST'
        ]);
    }

    /** @test */
    public function position_type_must_be_valid_enum_value()
    {
        $validTypes = ['DEV', 'BRANCH_HEAD', 'RECORDS_CUST', 'WAREHOUSE_CUST', 'EMPLOYEE'];
        
        foreach ($validTypes as $type) {
            $position = Position::factory()->create(['type' => $type]);
            $this->assertEquals($type, $position->type);
        }
        
        // Test that invalid types cannot be saved (if you have validation)
        // This would depend on how you handle validation in your application
        // try {
        //     $invalidPosition = Position::factory()->create(['type' => 'INVALID']);
        //     $this->fail('Expected validation exception for invalid type');
        // } catch (\Illuminate\Database\QueryException $e) {
        //     // Expected behavior if database has enum constraint
        //     $this->assertTrue(true);
        // }
    }

    /** @test */
    public function position_can_scope_by_type()
    {
        Position::factory()->devType()->create();
        Position::factory()->warehouseCustType()->create();
        Position::factory()->employeeType()->create();
        
        $recordsCustPositions = Position::where('type', 'RECORDS_CUST')->get();
        $this->assertCount(1, $recordsCustPositions);
        $this->assertEquals('RECORDS_CUST', $recordsCustPositions->first()->type);
    }

    /** @test */
    public function position_can_have_multiple_profiles_of_same_type()
    {
        $profile1 = UserProfile::factory()->create(['positions_id' => $this->position->id]);
        $profile2 = UserProfile::factory()->create(['positions_id' => $this->position->id]);
        
        $this->assertCount(2, $this->position->profiles);
        $this->assertEquals('RECORDS_CUST', $profile1->position->type);
        $this->assertEquals('RECORDS_CUST', $profile2->position->type);
    }
}
