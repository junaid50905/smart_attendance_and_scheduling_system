<?php

namespace Database\Seeders;


use Carbon\Carbon;
use Illuminate\Database\Seeder;
use App\Models\ClassSchedule;
use App\Models\Attendance;
use Illuminate\Support\Arr;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $schedules = ClassSchedule::with('batch.students')->get();

        $schedules->chunk(100)->each(function ($chunk) {
            foreach ($chunk as $schedule) {
                foreach ($schedule->batch->students as $student) {
                    Attendance::create([
                        'class_schedule_id' => $schedule->id,
                        'student_id' => $student->id,
                        'status' => Arr::random(['present', 'late', 'absent']),
                        'marked_at' => Carbon::parse($schedule->start_time)->copy()->addMinutes(rand(-5, 15)),
                    ]);
                }
            }
        });
    }
}
