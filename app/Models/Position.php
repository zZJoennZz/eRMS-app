<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
    ];

    public function profiles()
    {
        return $this->hasMany(UserProfile::class, 'positions_id', 'id');
    }
}
