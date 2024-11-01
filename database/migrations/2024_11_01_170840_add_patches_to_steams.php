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
            $table->timestamp('eventPatchesDate')->nullable();
            $table->timestamp('patchNotesDate')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('steams', function (Blueprint $table) {
            //
        });
    }
};
