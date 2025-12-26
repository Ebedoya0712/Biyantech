<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CampaignMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject_text;
    public $body_content;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($subject, $body_content)
    {
        $this->subject_text = $subject;
        $this->body_content = $body_content;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->subject_text)
            ->view('email.campaign');
    }
}
