<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPosition extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_profiles_id',
        'positions_id',
        'type',
    ];

    public function position()
    {
        return $this->hasOne(Position::class, 'id', 'positions_id');
    }

    public function user_profile()
    {
        return $this->belongsTo(UserProfile::class, 'id', 'user_profiles_id');
    }
}
