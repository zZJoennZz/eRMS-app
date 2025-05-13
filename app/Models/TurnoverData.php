<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TurnoverData extends Model
{
    //additional data for turnover. This will be used for warehouse turnover.
    use HasFactory;
    protected $fillable = [
        'turnovers_id',
        'data',
    ];
}
