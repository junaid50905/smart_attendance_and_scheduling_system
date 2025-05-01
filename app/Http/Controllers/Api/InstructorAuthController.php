<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class InstructorAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = Auth::guard('instructor')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::guard('instructor')->user(),
            'role' => 'instructor',
            'something' => [
                'one' => 'This is one data for student',
                'two' => 'This is two data for student'
            ]
        ]);
    }

    /**
     * Summary of dashboard
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function dashboard()
    {
        $instructor = Auth::guard('instructor')->user();

        return response()->json([
            'user' => $instructor,
            'role' => 'instructor',
            'something' => [
                'one' => 'This is one data for instructor',
                'two' => 'This is two data for instructor'
            ]
        ]);
    }

    /**
     * Summary of scheduleClasses
     * @return void
     */
    public function scheduleClasses()
    {
        $instructor = Auth::guard('instructor')->user();

        // Eager load batch and students
        $classSchedules = ClassSchedule::with(['batch.students'])
            ->where('instructor_id', $instructor->id)
            ->get();

        // Group by batch name and include student count
        $grouped = $classSchedules->groupBy(function ($item) {
            return $item->batch->name ?? 'Unknown Batch';
        })->map(function ($schedules) {
            $batch = $schedules->first()->batch;
            $studentCount = $batch ? $batch->students->count() : 0;

            return [
                'student_count' => $studentCount,
                'schedules' => $schedules
            ];
        });

        return response()->json([
            'class_schedules' => $grouped,
            'batch_count' => $grouped->count() // total number of distinct batches
        ]);
    }




    // public function scheduleClasses()
    // {
    //     $instructor = Auth::guard('instructor')->user();

    //     // Eager load batches with their class schedules and the batch info inside each schedule
    //     $batches = $instructor->batches()->with('classSchedules.batch')->get();

    //     // Extract class schedules from each batch and flatten into one collection
    //     $classSchedules = $batches->pluck('classSchedules')->flatten();

    //     return response()->json([
    //         'classSchedules' => $classSchedules
    //     ]);
    // }



    /**
     * Summary of logout
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::guard('instructor')->logout();
        return response()->json(['message' => 'Instructor logged out successfully']);
    }


}
