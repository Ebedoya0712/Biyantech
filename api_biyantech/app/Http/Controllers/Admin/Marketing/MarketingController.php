<?php

namespace App\Http\Controllers\Admin\Marketing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Jobs\SendEmailJob;
use App\Jobs\SendWhatsappJob;

class MarketingController extends Controller
{
    // Email Campaign (Campaigns Module)
    public function sendEmailCampaign(Request $request)
    {
        $request->validate([
            'subject' => 'required|string',
            'body_content' => 'required|string',
        ]);

        // Select 3 random students (type_user 1)
        $students = User::where('type_user', 1)->inRandomOrder()->take(3)->get();

        $count = 0;
        foreach ($students as $student) {
            // Dispatch Job
            SendEmailJob::dispatch($student->email, 'campaign', [
                'subject' => $request->subject,
                'body' => $request->body_content
            ]);
            $count++;
        }

        return response()->json([
            'message' => 'Campaña de Email está siendo procesada en segundo plano.',
            'students_count' => $count
        ]);
    }

    // Whatsapp Campaign (Promotions Module) - Real Implementation via Job
    public function sendWhatsappCampaign(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        // Select 3 random students (type_user 1)
        $students = User::where('type_user', 1)->inRandomOrder()->take(3)->get();

        $count = 0;
        foreach ($students as $student) {
            if ($student->phone) {
                // Dispatch Job
                SendWhatsappJob::dispatch($student->phone, $request->message);
                $count++;
            }
        }

        return response()->json([
            'message' => 'Campaña de Whatsapp está siendo procesada en segundo plano.',
            'students_count' => $count
        ]);
    }
}
