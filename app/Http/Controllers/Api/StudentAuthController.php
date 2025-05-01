<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;


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
