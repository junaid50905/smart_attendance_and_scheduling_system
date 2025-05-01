<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Batch;
use App\Models\Instructor;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


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

    public function dashboard()
    {
        $admins = Admin::count();
        $instructors = Instructor::count();
        $batches = Batch::count();
        $students = Student::count();
    
        return response()->json([
            'overallinfo' => [
                [
                    'name' => 'Admin',
                    'count' => $admins
                ],
                [
                    'name' => 'Instructor',
                    'count' => $instructors
                ],
                [
                    'name' => 'Batch',
                    'count' => $batches
                ],
                [
                    'name' => 'Student',
                    'count' => $students
                ],
            ]
        ]);
    }
    


    public function logout()
    {
        Auth::guard('admin')->logout();
        return response()->json(['message' => 'Admin logged out successfully']);
    }


}
