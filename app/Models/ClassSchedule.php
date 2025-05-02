<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class ClassSchedule extends Model
{
    use HasFactory;

    protected $table = 'class_schedules';

    protected $fillable = ['batch_id', 'instructor_id', 'topic', 'start_time', 'duration'];



    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }





}
