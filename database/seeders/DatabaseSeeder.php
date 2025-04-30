<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// Add the correct "use" statements for each Seeder
use Database\Seeders\StudentSeeder;
use Database\Seeders\InstructorSeeder;
use Database\Seeders\AttendanceSeeder;
use Database\Seeders\BatchSeeder;
use Database\Seeders\ClassScheduleSeeder;




class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            StudentSeeder::class,
            InstructorSeeder::class,
            AttendanceSeeder::class,
            BatchSeeder::class,
            ClassScheduleSeeder::class,            
        ]);
    }
}
