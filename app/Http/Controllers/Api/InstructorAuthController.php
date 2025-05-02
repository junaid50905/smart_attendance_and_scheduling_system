<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\BatchInstructor;
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
     * Summary of batches
     * @return void
     */
    public function batches()
    {
        $instructor = Auth::guard('instructor')->user();

        // Fetch batches with students and class schedules for the instructor
        $classSchedules = ClassSchedule::with(['batch.students'])
            ->where('instructor_id', $instructor->id)
            ->get();

        // Group schedules by batch_id and collect info
        $grouped = $classSchedules->groupBy('batch_id')->map(function ($schedules) {
            $batch = $schedules->first()->batch;

            return [
                'batch_id' => $batch->id ?? 'N/A',
                'batch_name' => $batch->name ?? 'N/A',
                'batch_students' => $batch->students->count(),
                'batch_schedules' => $schedules->count(),
            ];
        })->values(); // Reset keys

        return response()->json([
            'batches' => [
                'total_batches' => $grouped->count(),
                'batch_info' => $grouped
            ]
        ]);
    }

    /**
     * Summary of batchDetails
     * @return void
     */
    public function batchDetails($batchId)
    {
        $batch = Batch::with(['students', 'classSchedules.instructor'])->findOrFail($batchId);
        $instructor = Auth::guard('instructor')->user();

        // Sort class_schedules by id DESC
        $sortedSchedules = $batch->classSchedules->sortByDesc('id')->values();

        return response()->json([
            'instructor' => $instructor->id,
            'batch_id' => $batch->id,
            'batch_name' => $batch->name,
            'batch_students' => $batch->students,
            'total_students' => $batch->students->count(),
            'schedule_count' => $batch->classSchedules->count(),
            'class_schedules' => $sortedSchedules,
        ]);
    }

    /**
     * Summary of createNewScheduleClass
     * @param \Illuminate\Http\Request $request
     * @param mixed $batchId
     * @param mixed $instructorId
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function createNewScheduleClass(Request $request, $batchId, $instructorId)
    {
        $validated = $request->validate([
            'topic' => 'required|string|max:255',
            'start_time' => 'required|date',
            'duration' => 'required|integer|min:1',
        ]);

        $schedule = new ClassSchedule();
        $schedule->batch_id = $batchId;
        $schedule->instructor_id = $instructorId;
        $schedule->topic = $validated['topic'];
        $schedule->start_time = $validated['start_time'];
        $schedule->duration = $validated['duration'];
        $schedule->save();

        return response()->json([
            'message' => 'Schedule class created successfully.',
            'data' => $schedule
        ], 201);
    }




    /**
     * Summary of statistics
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $instructor = Auth::guard('instructor')->user();

        $batches = BatchInstructor::get()->count();

        return response()->json([
            'batches' => $batches
        ]);
    }



    /**
     * Summary of scheduleClasses
     * @return void
     */
    // public function scheduleClasses()
    // {
    //     $instructor = Auth::guard('instructor')->user();

    //     // Eager load batch and students
    //     $classSchedules = ClassSchedule::with(['batch.students'])
    //         ->where('instructor_id', $instructor->id)
    //         ->get();

    //     // Group by batch name and include student count
    //     $grouped = $classSchedules->groupBy(function ($item) {
    //         return $item->batch->name ?? 'Unknown Batch';
    //     })->map(function ($schedules) {
    //         $batch = $schedules->first()->batch;
    //         $studentCount = $batch ? $batch->students->count() : 0;

    //         return [
    //             'student_count' => $studentCount,
    //             'schedules' => $schedules
    //         ];
    //     });

    //     return response()->json([
    //         'class_schedules' => $grouped,
    //         'batch_count' => $grouped->count() // total number of distinct batches
    //     ]);
    // }
    // public function scheduleClasses()
    // {
    //     $instructor = Auth::guard('instructor')->user();

    //     // Eager load batch and students
    //     $classSchedules = ClassSchedule::with(['batch.students'])
    //         ->where('instructor_id', $instructor->id)
    //         ->get();

    //     // Group by batch_id
    //     $grouped = $classSchedules->groupBy('batch_id')->map(function ($schedules, $batchId) {
    //         $batch = $schedules->first()->batch;
    //         $studentCount = $batch ? $batch->students->count() : 0;

    //         return [
    //             'batch_info' => $batch,
    //             'student_count' => $studentCount,
    //             'schedules' => $schedules,
    //         ];
    //     })->values(); // reset keys to be a clean array

    //     return response()->json([
    //         'class_schedules' => $grouped,
    //         'batch_count' => $grouped->count(),
    //     ]);
    // }
    public function scheduleClasses()
    {
        $instructor = Auth::guard('instructor')->user();

        // Eager load batch and students
        $classSchedules = ClassSchedule::with(['batch.students'])
            ->where('instructor_id', $instructor->id)
            ->get();

        // Group by batch_id
        $grouped = $classSchedules->groupBy('batch_id')->map(function ($schedules, $batchId) {
            $batch = $schedules->first()->batch;

            // Hide batch from each schedule to avoid recursion
            $schedules = $schedules->map(function ($schedule) {
                return $schedule->makeHidden('batch');
            });

            $batchInfo = $batch;
            $batchInfo['student_count'] = $batch ? $batch->students->count() : 0;
            $batchInfo['schedule_classes'] = $schedules;

            return [
                'batch_info' => $batchInfo,
            ];
        })->values(); // reset keys to be a clean array

        return response()->json([
            'class_schedules' => $grouped,
            'batch_count' => $grouped->count(),
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
