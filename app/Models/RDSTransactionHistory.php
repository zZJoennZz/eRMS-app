<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class RDSTransactionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'r_d_s_transactions_id',
        'action',
        'action_date',
        'users_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'users_id', 'id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (Auth::check()) {
                $model->users_id = Auth::id();
            }
        });
    }
}
