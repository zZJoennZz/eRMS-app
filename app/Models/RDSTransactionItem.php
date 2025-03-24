<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDSTransactionItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'r_d_s_transactions_id',
        'r_d_s_records_id',
    ];

    public function transaction()
    {
        return $this->belongsTo(RDSTransaction::class, 'r_d_s_transactions_id', 'id');
    }

    public function record()
    {
        return $this->hasOne(RDSRecord::class, 'id', 'r_d_s_records_id');
    }
}
