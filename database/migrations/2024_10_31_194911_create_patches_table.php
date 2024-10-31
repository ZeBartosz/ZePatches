<?php

use App\Models\Steam;
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
        Schema::create('patches', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Steam::class)->constrained();
            $table->string('latestPatchDate');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patches');
    }
};
