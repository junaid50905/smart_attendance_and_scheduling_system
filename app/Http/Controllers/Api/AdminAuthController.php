<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
            'user' => Auth::guard('admin')->user()
        ]);
    }

    public function dashboard()
    {
        $admin = Auth::guard('admin')->user();

        return response()->json([
            'user' => $admin,
            'role' => 'admin',
            'something' => [
                'one' => 'This is one data for admin',
                'two' => 'This is two data for admin'
            ]
        ]);
    }

}
