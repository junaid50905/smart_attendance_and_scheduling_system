<?php

namespace Database\Factories;


use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class AttendanceFactory extends Factory
{
    protected $model = \App\Models\Attendance::class;

    public function definition()
    {
        return [
            'class_schedule_id' => \App\Models\ClassSchedule::factory(), // or assign manually
            'student_id' => \App\Models\Student::factory(),
            'status' => Arr::random(['present', 'late', 'absent']),
            'marked_at' => now(),
        ];
    }
}
