<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendances';

    protected $fillable = ['class_schedule_id', 'student_id', 'status', 'marked_at'];
}
