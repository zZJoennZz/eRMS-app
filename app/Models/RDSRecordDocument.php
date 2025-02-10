<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDSRecordDocument extends Model
{
    use HasFactory;
    protected $fillable = [
        'r_d_s_records_id',
        'source_of_documents',
        'records_disposition_schedules_id',
        'description_of_document',
        'period_covered_from',
        'period_covered_to',
        'projected_date_of_disposal',
        'remarks',
    ];

    public function record()
    {
        $this->belongsTo(RDSRecord::class, 'r_d_s_records_id', 'id');
    }
}
