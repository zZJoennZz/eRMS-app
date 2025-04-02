<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turnover extends Model
{
    use HasFactory;

    protected $fillable = [
        'selected_employee',
        'designation_status',
        'assumption_date',
        'from_date',
        'to_date',
        'current_job_holder_id',
        'incoming_job_holder_id',
        'status',
        'added_by',
        'branches_id',
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'selected_employee');
    }

    public function added_by_user()
    {
        return $this->hasOne(User::class, 'id', 'added_by');
    }

    public function items()
    {
        return $this->hasMany(TurnoverItem::class, 'turnovers_id', 'id');
    }
}
