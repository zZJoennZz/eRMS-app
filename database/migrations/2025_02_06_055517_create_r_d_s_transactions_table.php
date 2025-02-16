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
        Schema::create('r_d_s_transactions', function (Blueprint $table) {
            $table->id();
            $table->text('status');
            $table->text('type');
            $table->date('transaction_date');
            $table->unsignedBigInteger('receiver');
            $table->unsignedBigInteger('issuer');
            $table->unsignedBigInteger('submitted_by');
            $table->longText('remarks')->nullable();
            $table->timestamps();

            $table->foreign('receiver')->references('id')->on('users');
            $table->foreign('issuer')->references('id')->on('users');
            $table->foreign('submitted_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_d_s_transactions');
    }
};
