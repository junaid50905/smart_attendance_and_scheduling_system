<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Attendance;
use App\Models\Batch;
use App\Models\Instructor;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;


class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = Auth::guard('admin')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => Auth::guard('admin')->user(),
            'role' => 'admin',
        ]);
    }

    // public function dashboard()
    // {
    //     $admins = Admin::count();
    //     $instructors = Instructor::count();
    //     $batches = Batch::count();
    //     $students = Student::count();


    //     return response()->json([
    //         'overallinfo' => [
    //             [
    //                 'name' => 'Admin',
    //                 'count' => $admins
    //             ],
    //             [
    //                 'name' => 'Instructor',
    //                 'count' => $instructors
    //             ],
    //             [
    //                 'name' => 'Batch',
    //                 'count' => $batches
    //             ],
    //             [
    //                 'name' => 'Student',
    //                 'count' => $students
    //             ],
    //         ]
    //     ]);
    // }



    public function dashboard()
    {
        $admins = Admin::count();
        $instructors = Instructor::count();
        $batches = Batch::count();
        $students = Student::count();

        $presentCount = Attendance::where('status', 'present')->count();
        $absentCount = Attendance::where('status', 'absent')->count();
        $lateCount = Attendance::where('status', 'late')->count();


        return response()->json([
            'overallinfo' => [
                ['name' => 'Admin', 'count' => $admins, 'link' => null],
                ['name' => 'Instructor', 'count' => $instructors, 'link' => null],
                ['name' => 'Batch', 'count' => $batches, 'link' => 'all-batches'],
                ['name' => 'Student', 'count' => $students, 'link' => null],
            ],
            'attendanceStats' => [
                ['status' => 'Present', 'count' => $presentCount],
                ['status' => 'Absent', 'count' => $absentCount],
                ['status' => 'Late', 'count' => $lateCount],
            ]
        ]);
    }

    /**
     * Summary of branchesInfo
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function branchesInfo()
    {
        $batches = Batch::withCount(['students', 'instructors'])->get();

        return response()->json([
            'success' => true,
            'data' => $batches,
        ]);
    }

    public function exportAttendance()
    {
        $attendances = Attendance::with('student', 'classSchedule')->get();

        $csvData = "Student Name,Status,Marked At\n";
        foreach ($attendances as $record) {
            $csvData .= $record->student->name . "," . $record->status . "," . $record->marked_at . "\n";
        }

        $response = Response::make($csvData, 200);
        $response->header('Content-Type', 'text/csv');
        $response->header('Content-Disposition', 'attachment; filename="attendance.csv"');

        return $response;
    }


    // public function dashboard()
    // {
    //     $admins = Admin::count();
    //     $instructors = Instructor::count();
    //     $batches = Batch::count();
    //     $students = Student::count();

    //     $attendanceStats = Attendance::select('status', DB::raw('count(*) as count'))
    //         ->groupBy('status')
    //         ->get();

    //     $attendanceData = Attendance::with('student')
    //         ->get()
    //         ->map(function ($att) {
    //             return [
    //                 'student_name' => $att->student->name ?? 'N/A',
    //                 'status' => $att->status,
    //                 'marked_at' => $att->marked_at,
    //             ];
    //         });

    //     return response()->json([
    //         'overallinfo' => [
    //             ['name' => 'Admin', 'count' => $admins],
    //             ['name' => 'Instructor', 'count' => $instructors],
    //             ['name' => 'Batch', 'count' => $batches],
    //             ['name' => 'Student', 'count' => $students],
    //         ],
    //         'attendanceStats' => $attendanceStats,
    //         'attendanceData' => $attendanceData,
    //     ]);
    // }



    public function logout()
    {
        Auth::guard('admin')->logout();
        return response()->json(['message' => 'Admin logged out successfully']);
    }


}
