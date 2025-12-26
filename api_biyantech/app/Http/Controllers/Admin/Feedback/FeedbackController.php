<?php

namespace App\Http\Controllers\Admin\Feedback;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Jobs\SendEmailJob;

class FeedbackController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'body_content' => 'required|string',
            'url' => 'required|url',
        ]);

        // Select 3 random students.
        $students = User::where('type_user', 1)->inRandomOrder()->take(3)->get();

        $count = 0;
        foreach ($students as $student) {
            // Dispatch Job
            SendEmailJob::dispatch($student->email, 'feedback', [
                'body' => $request->body_content,
                'url' => $request->url
            ]);
            $count++;
        }

        return response()->json([
            'message' => 'Feedback emails están siendo procesados en segundo plano.',
            'count' => $count
        ]);
    }
}
