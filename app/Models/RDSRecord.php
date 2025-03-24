<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDSRecord extends Model
{
    use HasFactory;
    protected $fillable = [
        'status',
        'box_number',
        'branches_id',
        'submitted_by',
    ];

    public function documents()
    {
        return $this->hasMany(RDSRecordDocument::class, 'r_d_s_records_id', 'id');
    }

    public function branch()
    {
        return $this->hasOne(Branch::class, 'id', 'branches_id');
    }

    public function rds()
    {
        return $this->hasOne(RecordsDispositionSchedule::class, 'id', 'records_disposition_schedules_id');
    }

    public function history()
    {
        return $this->hasMany(RDSRecordHistory::class, 'r_d_s_records_id', 'id');
    }

    public function latest_history()
    {
        return $this->hasOne(RDSRecordHistory::class, 'r_d_s_records_id', 'id')->latestOfMany();
    }

    public function submitted_by_user()
    {
        return $this->hasOne(User::class, 'id', 'submitted_by');
    }

    public function transactions()
    {
        return $this->hasMany(RDSTransactionItem::class, 'r_d_s_records_id', 'id');
    }
}
