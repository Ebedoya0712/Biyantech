<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FeedbackMail extends Mailable
{
    use Queueable, SerializesModels;

    public $body_content;
    public $url;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($body_content, $url)
    {
        $this->body_content = $body_content;
        $this->url = $url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject("Queremos escuchar tu opinión - Biyantech")
            ->view('email.feedback');
    }
}
