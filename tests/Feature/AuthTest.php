<?php

use App\Enums\RoleEnum;
use App\Enums\StatusUserEnum;
use App\Models\User;

uses()->group('auth');

test('halaman login dapat diakses', function (): void {
    $this->get(route('login'))->assertOk();
});

test('user dapat login dan redirect ke dashboard', function (): void {
    $user = User::factory()->create([
        'username' => 'loginuser',
        'password' => bcrypt('password123'),
        'status' => StatusUserEnum::ACTIVE,
    ]);

    $this->post(route('login'), [
        'username' => 'loginuser',
        'password' => 'password123',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('user dengan password salah ditolak', function (): void {
    User::factory()->create([
        'username' => 'wrongpass',
        'password' => bcrypt('password123'),
        'status' => StatusUserEnum::ACTIVE,
    ]);

    $this->post(route('login'), [
        'username' => 'wrongpass',
        'password' => 'salah',
    ])->assertInvalid(['username']);

    $this->assertGuest();
});

test('user pending tidak bisa login', function (): void {
    User::factory()->create([
        'username' => 'pendinguser',
        'password' => bcrypt('password123'),
        'status' => StatusUserEnum::PENDING,
    ]);

    $this->post(route('login'), [
        'username' => 'pendinguser',
        'password' => 'password123',
    ])->assertInvalid(['username']);

    $this->assertGuest();
});

test('register membuat user berstatus pending', function (): void {
    $unit = \App\Models\Unit::factory()->create();

    $this->post(route('register'), [
        'name' => 'Budi',
        'username' => 'budi',
        'email' => 'budi@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'unit_id' => $unit->id,
        'role' => RoleEnum::STAF->value,
    ])->assertRedirect(route('login'));

    $this->assertDatabaseHas('users', [
        'username' => 'budi',
        'status' => StatusUserEnum::PENDING->value,
    ]);
});

test('user login dapat mengakses dashboard', function (): void {
    $user = User::factory()->create(['status' => StatusUserEnum::ACTIVE]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();
});
