<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'users_id',
        'first_name',
        'middle_name',
        'last_name',
        'others',
        'positions_id',
    ];

    public function position()
    {
        return $this->hasOne(Position::class, 'id', 'positions_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'users_id');
    }
}
