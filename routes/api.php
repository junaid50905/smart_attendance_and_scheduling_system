<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\InstructorAuthController;
use App\Http\Controllers\Api\StudentAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::get('/user', function (Request $request) {
    return 'do';
});



// Student
Route::post('student/login', [StudentAuthController::class, 'login']);
Route::middleware('auth:student')->get('student/dashboard', [StudentAuthController::class, 'dashboard']);

// Instructor
Route::post('instructor/login', [InstructorAuthController::class, 'login']);
Route::middleware('auth:instructor')->get('instructor/dashboard', [InstructorAuthController::class, 'dashboard']);

// Admin
Route::post('admin/login', [AdminAuthController::class, 'login']);
Route::middleware('auth:admin')->get('admin/dashboard', [AdminAuthController::class, 'dashboard']);