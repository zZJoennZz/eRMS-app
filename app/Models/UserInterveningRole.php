<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInterveningRole extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_profiles_id',
        'intervening_roles_id',
    ];

    public function profiles()
    {
        return $this->hasMany(UserProfile::class, 'id', 'user_profiles_id');
    }

    public function intervening()
    {
        return $this->hasOne(InterveningRole::class, 'id', 'intervening_roles_id');
    }
}
