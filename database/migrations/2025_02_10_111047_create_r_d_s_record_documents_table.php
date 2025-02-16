<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('r_d_s_record_documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('r_d_s_records_id');
            $table->unsignedBigInteger('records_disposition_schedules_id');
            $table->longText('source_of_documents');
            $table->longText('description_of_document');
            $table->date('period_covered_from');
            $table->date('period_covered_to');
            $table->longText('remarks')->nullable();
            $table->date('projected_date_of_disposal');
            $table->timestamps();

            $table->foreign('r_d_s_records_id')->references('id')->on('r_d_s_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_d_s_record_documents');
    }
};
