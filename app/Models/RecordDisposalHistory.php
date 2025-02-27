<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecordDisposalHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'records_disposals_id',
        'remarks',
        'other',
        'users_id',
    ];
}
