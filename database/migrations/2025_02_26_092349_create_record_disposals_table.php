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
        Schema::create('record_disposals', function (Blueprint $table) {
            $table->id();
            $table->text('status');
            $table->unsignedBigInteger('users_id');
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('branches_id');
            $table->unsignedBigInteger('branch_head_id');
            $table->text('other')->nullable();
            $table->timestamps();

            $table->foreign('users_id')->references('id')->on('users');
            $table->foreign('branches_id')->references('id')->on('branches');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_disposals');
    }
};
