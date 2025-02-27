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
        Schema::create('record_disposal_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('record_disposals_id');
            $table->unsignedBigInteger('r_d_s_records_id');
            $table->longText('other')->nullable();
            $table->timestamps();

            $table->foreign('record_disposals_id')->references('id')->on('record_disposals');
            $table->foreign('r_d_s_records_id')->references('id')->on('r_d_s_records');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_disposal_items');
    }
};
