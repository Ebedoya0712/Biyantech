<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PagoMovilApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $sale;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($sale)
    {
        $this->sale = $sale;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $sale = $this->sale;
        return $this->subject('✅ Pago Móvil Aprobado - Acceso a tus Cursos')
                    ->view('email.pago-movil-approved', compact('sale'));
    }
}
