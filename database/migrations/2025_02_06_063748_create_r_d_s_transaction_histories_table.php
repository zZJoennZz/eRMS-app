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
        Schema::create('r_d_s_transaction_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('r_d_s_transactions_id');
            $table->longText('action');
            $table->date('action_date');
            $table->timestamps();

            $table->foreign('r_d_s_transactions_id')->references('id')->on('r_d_s_transactions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_d_s_transaction_histories');
    }
};
