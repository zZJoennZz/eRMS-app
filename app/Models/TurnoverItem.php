<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TurnoverItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'turnovers_id',
        'r_d_s_records_id',
        'others',
    ];

    public function turnover()
    {
        return $this->belongsTo(Turnover::class, 'turnovers_id', 'id');
    }

    public function rds_record()
    {
        return $this->hasOne(RDSRecord::class, 'id', 'r_d_s_records_id');
    }
}
