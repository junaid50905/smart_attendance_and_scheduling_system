<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ClassScheduleFactory extends Factory
{
    protected $model = \App\Models\ClassSchedule::class;

    public function definition()
    {
        return [
            'batch_id' => \App\Models\Batch::factory(), // or assign manually in seeder
            'topic' => $this->faker->sentence(3),
            'start_time' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'duration' => $this->faker->numberBetween(30, 90),
        ];
    }
}
