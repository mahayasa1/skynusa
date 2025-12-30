<?php

namespace App\Mail;

use App\Models\Pesanan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Pesanan $pesanan
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Pesanan Anda Telah Diterima - ' . $this->pesanan->code,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.order.create',
            with: [
                'pesanan' => $this->pesanan,
                'trackingUrl' => route('order.tracking') . '?code=' . $this->pesanan->code,
            ],
        );
    }
}