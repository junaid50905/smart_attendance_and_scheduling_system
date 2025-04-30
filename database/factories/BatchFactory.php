<?php

namespace Database\Factories;


use Illuminate\Database\Eloquent\Factories\Factory;

class BatchFactory extends Factory
{
    protected $model = \App\Models\Batch::class;

    public function definition()
    {
        return [
            'name' => 'Batch ' . $this->faker->unique()->word,
        ];
    }
}
