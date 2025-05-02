<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use App\Models\Attendance;


class StudentAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = Auth::guard('student')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::guard('student')->user(),
            'role' => 'student',
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
        $student = Auth::guard('student')->user();

        return response()->json([
            'user' => $student,
            'role' => 'student',
            'something' => [
                'one' => 'This is one data for student',
                'two' => 'This is two data for student'
            ]
        ]);
    }

    /**
     * Summary of upcomingClasses
     * @return void
     */
    public function upcomingClasses()
    {
        $student = Auth::guard('student')->user();

        // Get batch IDs the student is enrolled in
        $batchIds = $student->batches()->pluck('batches.id');

        // Get current time
        $now = Carbon::now();

        // Get class schedules with future end times
        $upcomingClasses = ClassSchedule::with(['batch', 'instructor'])
            ->whereIn('batch_id', $batchIds)
            ->whereRaw("DATE_ADD(start_time, INTERVAL duration MINUTE) > ?", [$now])
            ->orderBy('start_time', 'asc')
            ->get();

        // Add attendance data to each class
        $classesWithAttendance = $upcomingClasses->map(function ($class) use ($student) {
            $attendance = Attendance::where('class_schedule_id', $class->id)
                ->where('student_id', $student->id)
                ->first();

            // Attach the full attendance record or null
            $class->attendance = $attendance;

            return $class;
        });

        return response()->json([
            'student_id' => $student->id,
            'upcoming_classes' => $classesWithAttendance
        ]);
    }



    /**
     * Summary of markAttendance
     * @param mixed $classScheduleId
     * @param mixed $studentId
     * @return mixed|\Illuminate\Http\JsonResponse
     */

     public function markAttendance($classScheduleId, $studentId)
     {
         // Check if attendance already exists
         $existing = Attendance::where('class_schedule_id', $classScheduleId)
             ->where('student_id', $studentId)
             ->first();
     
         if ($existing) {
             return response()->json([
                 'message' => 'Attendance already marked.'
             ], 409); // Conflict
         }
     
         // Retrieve the class schedule
         $classSchedule = ClassSchedule::find($classScheduleId);
     
         if (!$classSchedule) {
             return response()->json([
                 'message' => 'Class schedule not found.'
             ], 404);
         }
     
         // Parse the class start time
         $start_time = Carbon::parse($classSchedule->start_time);
         $attendance_deadline = $start_time->copy()->addMinutes(10);
         $now = Carbon::now();
     
         // Determine attendance status
         $status = $now->lessThanOrEqualTo($attendance_deadline) ? 'present' : 'late';
     
         // Create attendance record
         $attendance = Attendance::create([
             'class_schedule_id' => $classScheduleId,
             'student_id' => $studentId,
             'status' => $status,
             'marked_at' => $now,
         ]);
     
         return response()->json([
             'message' => 'Attendance marked successfully.',
             'data' => $attendance
         ]);
     }

    // public function markAttendance($classScheduleId, $studentId)
    // {
    //     // Check if attendance already exists
    //     $existing = Attendance::where('class_schedule_id', $classScheduleId)
    //         ->where('student_id', $studentId)
    //         ->first();

    //     if ($existing) {
    //         return response()->json([
    //             'message' => 'Attendance already marked.'
    //         ], 409); // Conflict
    //     }

    //     // Retrieve class schedule
    //     $classSchedule = ClassSchedule::find($classScheduleId);

    //     if (!$classSchedule) {
    //         return response()->json([
    //             'message' => 'Class schedule not found.'
    //         ], 404);
    //     }

    //     // Parse start time and calculate attendance window end time
    //     $start_time = Carbon::parse($classSchedule->start_time);
    //     $end_time = $start_time->copy()->addMinutes(10);
    //     $now = Carbon::now();

    //     // Determine attendance status based on current time
    //     $status = $now->gt($end_time) ? 'late' : 'present';

    //     // Create attendance record
    //     $attendance = Attendance::create([
    //         'class_schedule_id' => $classScheduleId,
    //         'student_id' => $studentId,
    //         'status' => $status,
    //         'marked_at' => $now,
    //     ]);

    //     return response()->json([
    //         'message' => 'Attendance marked successfully.',
    //         'data' => $attendance
    //     ]);
    // }

    // public function markAttendance($classScheduleId, $studentId)
    // {
    //     // Check if attendance already exists
    //     $existing = Attendance::where('class_schedule_id', $classScheduleId)
    //         ->where('student_id', $studentId)
    //         ->first();

    //     if ($existing) {
    //         return response()->json([
    //             'message' => 'Attendance already marked.'
    //         ], 409); // Conflict
    //     }

    //     $classSchedule = ClassSchedule::findOrFail($classScheduleId);
    //     $startTime = Carbon::parse($classSchedule->start_time);
    //     $now = Carbon::now();

    //     // Determine attendance status
    //     if ($now->between($startTime->copy()->subMinutes(10), $startTime->copy()->addMinutes(10))) {
    //         $status = 'present';
    //     } elseif ($now->greaterThan($startTime->copy()->addMinutes(10))) {
    //         $status = 'late';
    //     } else {
    //         $status = 'absent';
    //     }

    //     $attendance = Attendance::create([
    //         'class_schedule_id' => $classScheduleId,
    //         'student_id' => $studentId,
    //         'status' => $status,
    //         'marked_at' => $now,
    //     ]);

    //     return response()->json([
    //         'message' => 'Attendance marked successfully.',
    //         'data' => $attendance
    //     ]);
    // }

    /**
     * Summary of logout
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::guard('student')->logout();
        return response()->json(['message' => 'Student logged out successfully']);
    }


}
