<?php

namespace Database\Seeders;


use Illuminate\Database\Seeder;
use App\Models\Batch;
use App\Models\Student;
use App\Models\Instructor;

class BatchSeeder extends Seeder
{
    public function run(): void
    {
        Batch::factory(100)->create()->each(function ($batch) {
            $students = Student::inRandomOrder()->take(rand(10, 30))->pluck('id');
            $instructors = Instructor::inRandomOrder()->take(rand(1, 3))->pluck('id');
            $batch->students()->attach($students);
            $batch->instructors()->attach($instructors);
        });
    }
}
