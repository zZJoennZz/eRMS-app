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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('users_id');
            $table->text("first_name");
            $table->text("middle_name")->nullable();
            $table->text("last_name");
            $table->longText("others")->nullable()->default("");
            $table->unsignedBigInteger("positions_id");
            $table->timestamps();

            $table->foreign("positions_id")->references("id")->on("positions");
            $table->foreign("users_id")->references("id")->on("users");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
