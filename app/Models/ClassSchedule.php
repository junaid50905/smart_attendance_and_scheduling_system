<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    protected $table = 'class_schedules';

    protected $fillable = ['batch_id', 'topic', 'start_time', 'duration'];
}
