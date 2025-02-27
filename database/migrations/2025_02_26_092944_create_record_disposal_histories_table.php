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
        Schema::create('record_disposal_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('record_disposals_id');
            $table->text('action');
            $table->longText('remarks')->nullable();
            $table->longText('other')->nullable();
            $table->unsignedBigInteger('users_id');
            $table->timestamps();

            $table->foreign('users_id')->references('id')->on('users');
            $table->foreign('record_disposals_id')->references('id')->on('record_disposals');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_disposal_histories');
    }
};
