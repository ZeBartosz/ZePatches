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
        Schema::table('steams', function (Blueprint $table) {
            $table->string('developer')->default('');
            $table->string('releaseDate')->default('');
            $table->string('banner')->default('');
            $table->string('type')->default('');
            $table->integer('moreDetails')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('steams', function (Blueprint $table) {
            Schema::table('steams', function ($table) {
                $table->dropColumn('developer');
                $table->dropColumn('releaseDate');
                $table->dropColumn('banner');
                $table->dropColumn('type');
                $table->dropColumn('moreDetails');
            });
        });
    }
};
