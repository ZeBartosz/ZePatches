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
        Schema::create('steams', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('appId');
            $table->index('appId');
            $table->string('name')->default('')->nullable();
            $table->string('developer')->default('');
            $table->string('releaseDate')->default('');
            $table->string('banner')->default('');
            $table->string('type')->default('');
            $table->integer('moreDetails')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('steams');
    }
};
