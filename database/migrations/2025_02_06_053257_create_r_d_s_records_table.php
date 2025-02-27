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
            $table->longText('box_number')->nullable()->default('');
            $table->unsignedBigInteger('branches_id');
            $table->unsignedBigInteger('submitted_by');
            $table->timestamps();

            $table->foreign('branches_id')->references('id')->on('branches');
            $table->foreign('submitted_by')->references('id')->on('users');
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
