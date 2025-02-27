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
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string("code");
            $table->string("name");
            $table->string("agency_name")->nullable();
            $table->longText("full_address")->nullable();
            $table->text("telephone_number")->nullable();
            $table->text("email_address")->nullable();
            $table->text("location_of_records")->nullable();
            $table->longText("others")->nullable()->default("");
            $table->unsignedBigInteger("clusters_id");
            $table->unsignedBigInteger("sub_clusters_id")->default(0);
            $table->timestamps();

            $table->foreign("clusters_id")->references("id")->on("clusters");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('branches');
    }
};
