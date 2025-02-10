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
        Schema::create('r_d_s_records', function (Blueprint $table) {
            $table->id();
            $table->text("status");
            $table->unsignedBigInteger('records_disposition_schedules_id');
            $table->longText('box_number');
            $table->longText('source_of_documents');
            $table->longText('description_of_document');
            $table->date('period_covered_from');
            $table->date('period_covered_to');
            $table->longText('remarks');
            $table->date('projected_date_of_disposal');
            $table->unsignedBigInteger('branches_id');
            $table->timestamps();

            $table->foreign('records_disposition_schedules_id')->references('id')->on('records_disposition_schedules');
            $table->foreign('branches_id')->references('id')->on('branches');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_d_s_records');
    }
};
