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
Route::middleware('auth:student')->get('student/upcoming-classes', [StudentAuthController::class, 'upcomingClasses']);
Route::middleware('auth:student')->post('student/mark-attendance/{classScheduleId}/{studentId}', [StudentAuthController::class, 'markAttendance']);
Route::middleware('auth:student')->post('student/logout', [StudentAuthController::class, 'logout']);


// Instructor
Route::post('instructor/login', [InstructorAuthController::class, 'login']);
Route::middleware('auth:instructor')->get('instructor/dashboard', [InstructorAuthController::class, 'dashboard']);
Route::middleware('auth:instructor')->get('instructor/batches', [InstructorAuthController::class, 'batches']);
Route::middleware('auth:instructor')->get('instructor/batches/{batchId}', [InstructorAuthController::class, 'batchDetails']);
Route::middleware('auth:instructor')->post('instructor/batches/{batchId}/create-new-schedule-class/{instructorId}', [InstructorAuthController::class, 'createNewScheduleClass']);
Route::middleware('auth:instructor')->get('instructor/statistics', [InstructorAuthController::class, 'statistics']);
Route::middleware('auth:instructor')->get('instructor/schedule-classes',   [InstructorAuthController::class, 'scheduleClasses']);
Route::middleware('auth:instructor')->post('instructor/logout', [InstructorAuthController::class, 'logout']);


// Admin
Route::post('admin/login', [AdminAuthController::class, 'login']);
Route::middleware('auth:admin')->get('admin/dashboard', [AdminAuthController::class, 'dashboard']);
Route::middleware('auth:admin')->get('admin/batches', [AdminAuthController::class, 'branchesInfo']);
Route::middleware('auth:admin')->get('admin/export-attendance', [AdminAuthController::class, 'exportAttendance']);
Route::middleware('auth:admin')->post('admin/logout', [AdminAuthController::class, 'logout']);

