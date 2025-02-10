<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDSRecordHistory extends Model
{
    use HasFactory;
    protected $fillable = [
        'r_d_s_records_id',
        'users_id',
        'action',
        'location',
    ];

    public function record()
    {
        return $this->belongsTo(RDSRecord::class, 'id', 'r_d_s_records_id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'users_id');
    }
}
