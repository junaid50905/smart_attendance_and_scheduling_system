<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Batch extends Model
{
    use HasFactory;

    protected $table = 'batches';

    protected $fillable = ['name'];




    public function instructors()
    {
        return $this->belongsToMany(Instructor::class);
    }

    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class)->orderByDesc('id');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'batch_student');
    }





}
