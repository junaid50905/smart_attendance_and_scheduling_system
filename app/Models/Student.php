<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;


class Student extends Authenticatable implements JWTSubject
{
    use HasFactory;

    protected $table = 'students';

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password'];


    // JWT implementation
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // Relationships

    public function batches()
    {
        return $this->belongsToMany(Batch::class, 'batch_student');
    }


    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

}
