<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\CampaignMail;
use App\Mail\FeedbackMail;

class SendEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;
    protected $mailable_type;
    protected $data;

    /**
     * Create a new job instance.
     *
     * @param string $email
     * @param string $mailable_type 'campaign' or 'feedback'
     * @param array $data ['subject' => ?, 'body' => ?, 'url' => ?]
     */
    public function __construct($email, $mailable_type, $data)
    {
        $this->email = $email;
        $this->mailable_type = $mailable_type;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        if ($this->mailable_type == 'campaign') {
            Mail::to($this->email)->send(new CampaignMail($this->data['subject'], $this->data['body']));
        } elseif ($this->mailable_type == 'feedback') {
            Mail::to($this->email)->send(new FeedbackMail($this->data['body'], $this->data['url']));
        }
    }
}
