<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('turnovers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('selected_employee')->default(0);
            $table->string('designation_status');
            $table->date('assumption_date')->nullable();
            $table->date('from_date')->nullable();
            $table->date('to_date')->nullable();
            $table->string('current_job_holder_id');
            $table->string('incoming_job_holder_id');
            $table->string('status')->default('PENDING'); // Added status column
            $table->unsignedBigInteger('added_by');
            $table->unsignedBigInteger('branches_id');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('turnovers');
    }
};
