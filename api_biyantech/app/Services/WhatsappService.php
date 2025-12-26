<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsappService
{
    protected $sid;
    protected $token;
    protected $from;

    public function __construct()
    {
        $this->sid = env('TWILIO_SID');
        $this->token = env('TWILIO_TOKEN');
        $this->from = env('TWILIO_WHATSAPP_FROM');
    }

    public function sendMessage($to, $message)
    {
        if (!$this->sid || !$this->token || !$this->from) {
            Log::error('Twilio credentials not configured.');
            return false;
        }

        // Auto-format phone number to E.164 (Assuming Venezuela +58 if assumes local)
        $to = $this->formatPhoneNumber($to);

        // Ensure "whatsapp:" prefix
        $to = strpos($to, 'whatsapp:') === 0 ? $to : 'whatsapp:' . $to;
        $from = strpos($this->from, 'whatsapp:') === 0 ? $this->from : 'whatsapp:' . $this->from;

        try {
            $url = "https://api.twilio.com/2010-04-01/Accounts/{$this->sid}/Messages.json";

            $response = Http::withBasicAuth($this->sid, $this->token)
                ->asForm()
                ->post($url, [
                    'From' => $from,
                    'To' => $to,
                    'Body' => $message,
                ]);

            if ($response->successful()) {
                Log::info("Whatsapp sent to {$to}");
                return true;
            } else {
                Log::error("Twilio Error: " . $response->body());
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Whatsapp Service Error: " . $e->getMessage());
            return false;
        }
    }

    private function formatPhoneNumber($phone)
    {
        // Remove everything that is not a digit
        $phone = preg_replace('/\D/', '', $phone);

        // If starts with '04', it's likely a local mobile Venezuelan number (e.g. 0414...)
        if (substr($phone, 0, 2) === '04') {
            $phone = '+58' . substr($phone, 1);
        }
        // If it doesn't start with '+', add it
        elseif (substr($phone, 0, 1) !== '+') {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
