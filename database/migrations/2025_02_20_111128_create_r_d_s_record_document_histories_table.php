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
        Schema::create('r_d_s_record_document_histories', function (Blueprint $table) {
            $table->id();
            $table->text("action");
            $table->text("status")->nullable();
            $table->longText("remarks")->nullable();
            $table->unsignedBigInteger("record_documents_id");
            $table->unsignedBigInteger("users_id");
            $table->unsignedBigInteger("related_history_id")->default(0);
            $table->timestamps();

            $table->foreign("record_documents_id")->references("id")->on("r_d_s_record_documents");
            $table->foreign("users_id")->references("id")->on("users");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('r_d_s_record_document_histories');
    }
};
