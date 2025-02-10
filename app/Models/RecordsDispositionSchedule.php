<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecordsDispositionSchedule extends Model
{
    use HasFactory;
    protected $fillable = [
        'item_number',
        'record_series_title_and_description',
        'record_series_title_and_description_1',
        'active',
        'storage',
        'remarks',
        'has_condition',
    ];
}
