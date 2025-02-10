<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDSTransaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'status', //PENDING, APPROVED, CANCELLED, DECLINED
        'type', //TRANSFER, WITHDRAW, BORROW, RETURN
        'transaction_date',
        'receiver',
        'issuer',
        'submitted_by',
        'remarks',
    ];
}
