<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecordDisposalItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'record_disposals_id',
        'r_d_s_records_id',
        'other',
    ];

    public function record()
    {
        return $this->hasOne(RDSRecord::class, 'id', 'r_d_s_records_id');
    }

    public function disposal()
    {
        return $this->belongsTo(RecordDisposal::class, 'id', 'record_disposals_id');
    }
}
