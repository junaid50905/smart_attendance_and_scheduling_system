<?php

namespace Database\Factories;

use App\Models\Instructor;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassScheduleFactory extends Factory
{
    protected $model = \App\Models\ClassSchedule::class;

    public function definition()
    {
        return [
            'batch_id' => \App\Models\Batch::factory(), // or assign manually in seeder
            'instructor_id' => Instructor::factory(),
            'topic' => $this->faker->sentence(3),
            'start_time' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'duration' => $this->faker->numberBetween(30, 90),
        ];
    }
}
