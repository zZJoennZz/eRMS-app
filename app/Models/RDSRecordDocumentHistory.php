<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDSRecordDocumentHistory extends Model
{
    use HasFactory;
    protected $fillable = [
        'action',
        'remarks',
        'status',
        'record_documents_id',
        'users_id',
        'related_history_id',
    ];

    public function document()
    {
        return $this->belongsTo(RDSRecordDocument::class, 'record_documents_id', 'id');
    }

    public function action_by()
    {
        return $this->hasOne(User::class, 'id', 'users_id');
    }

    public function parent()
    {
        return $this->belongsTo(RDSRecordDocumentHistory::class, 'related_history_id');
    }

    public function children()
    {
        return $this->hasMany(RDSRecordDocumentHistory::class, 'related_history_id');
    }
}
