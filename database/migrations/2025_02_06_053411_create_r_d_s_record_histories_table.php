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
        Schema::create('r_d_s_record_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('r_d_s_records_id');
            $table->unsignedBigInteger('users_id');
            $table->text('action');
            $table->longText('location');
            $table->timestamps();

            $table->foreign('r_d_s_records_id')->references('id')->on('r_d_s_records');
            $table->foreign('users_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_d_s_record_histories');
    }
};
