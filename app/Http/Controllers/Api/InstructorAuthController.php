<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


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
            'user' => Auth::guard('instructor')->user()
        ]);
    }

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

}
