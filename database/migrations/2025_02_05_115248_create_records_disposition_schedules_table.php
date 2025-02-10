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
        Schema::create('records_disposition_schedules', function (Blueprint $table) {
            $table->id();
            $table->text('item_number');
            $table->text('record_series_title_and_description');
            $table->text('record_series_title_and_description_1')->nullable()->default("");
            $table->bigInteger("active");
            $table->bigInteger("storage");
            $table->longText("remarks")->nullable();
            $table->boolean("has_condition")->nullable()->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('records_disposition_schedules');
    }
};
