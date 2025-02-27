<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;
    protected $fillable = [
        'code',
        'name',
        'agency_name',
        'full_address',
        'telephone_number',
        'email_address',
        'location_of_records',
        'others',
        'clusters_id',
    ];

    public function cluster()
    {
        return $this->belongsTo(Cluster::class, 'clusters_id', 'id');
    }
}
