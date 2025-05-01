<?php

namespace Database\Seeders;


use App\Models\Instructor;
use Illuminate\Database\Seeder;
use App\Models\Batch;
use App\Models\ClassSchedule;

class ClassScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $batchIds = Batch::pluck('id');
        $instructorIds = Instructor::pluck('id');


        foreach (range(1, 3000) as $i) {
            ClassSchedule::create([
                'batch_id' => $batchIds->random(),
                'instructor_id' => $instructorIds->random(),
                'topic' => 'Topic ' . $i,
                'start_time' => now()->subDays(rand(0, 60))->addMinutes(rand(0, 1440)),
                'duration' => rand(30, 90),
            ]);
        }
    }
}
