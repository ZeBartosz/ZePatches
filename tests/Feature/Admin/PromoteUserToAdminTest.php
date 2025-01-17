<?php

namespace Tests\Feature;

use App\Http\Controllers\Auth\AdminController;
use App\Models\User;
use function Pest\Laravel\assertDatabaseHas;

it('Promote User To Admin', function () {

    $user = User::factory(1)->create();

    $controller = new AdminController();

    $controller->promoteUserToAdmin($user[0]->id);

    assertDatabaseHas('users', [
        'id' => $user[0]->id,
        'is_admin' => true,
    ]);

});

it('Demote User from Admin', function () {

    $user = User::factory(1)->create();

    $controller = new AdminController();

    $controller->demoteUserToAdmin($user[0]->id);

    assertDatabaseHas('users', [
        'id' => $user[0]->id,
        'is_admin' => false,
    ]);

});

