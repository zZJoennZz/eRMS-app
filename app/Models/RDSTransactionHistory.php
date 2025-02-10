<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDSTransactionHistory extends Model
{
    use HasFactory;
    protected $fillable = [
        'r_d_s_transactions_id',
        'action',
        'action_date',
    ];
}
