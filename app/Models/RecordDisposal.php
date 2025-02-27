<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecordDisposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'users_id',
        'remarks',
        'branches_id',
        'other',
    ];

    public function items()
    {
        return $this->hasMany(RecordDisposalItem::class, 'record_disposals_id', 'id');
    }

    public function history()
    {
        return $this->hasMany(RecordDisposalHistory::class, 'record_disposals_id', 'id');
    }

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'users_id');
    }

    public function branch()
    {
        return $this->hasOne(Branch::class, 'id', 'branches_id');
    }
}
