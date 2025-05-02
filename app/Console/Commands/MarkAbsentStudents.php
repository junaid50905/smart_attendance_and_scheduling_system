<?php



use Illuminate\Console\Command;
use App\Models\ClassSchedule;
use App\Models\Attendance;
use Carbon\Carbon;

class MarkAbsentStudents extends Command
{
    protected $signature = 'attendance:mark-absent';
    protected $description = 'Mark absent students who did not attend their classes';

    public function handle()
    {
        $now = Carbon::now();

        // Fetch classes that have ended within the last hour
        $classes = ClassSchedule::where('start_time', '<=', $now)
            ->whereRaw('DATE_ADD(start_time, INTERVAL duration MINUTE) <= ?', [$now])
            ->get();

        foreach ($classes as $class) {
            $students = $class->batch->students;

            foreach ($students as $student) {
                $existing = Attendance::where('class_schedule_id', $class->id)
                    ->where('student_id', $student->id)
                    ->first();

                if (!$existing) {
                    Attendance::create([
                        'class_schedule_id' => $class->id,
                        'student_id' => $student->id,
                        'status' => 'absent',
                        'marked_at' => $now,
                    ]);
                }
            }
        }

        $this->info('Absent students have been marked.');
    }
}
