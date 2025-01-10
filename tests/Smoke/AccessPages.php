<?php

it('Homepage Test', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
