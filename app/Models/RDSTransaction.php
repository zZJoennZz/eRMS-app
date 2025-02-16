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

    public function history()
    {
        return $this->hasMany(RDSTransactionHistory::class, 'r_d_s_transactions_id', 'id');
    }

    public function rds_records()
    {
        return $this->hasMany(RDSTransactionItem::class, 'r_d_s_transactions_id', 'id');
    }

    public function receiver_user()
    {
        return $this->hasOne(User::class, 'id', 'receiver');
    }

    public function issuer_user()
    {
        return $this->hasOne(User::class, 'id', 'issuer');
    }

    public function submitted_by_user()
    {
        return $this->hasOne(User::class, 'id', 'submitted_by');
    }
}
