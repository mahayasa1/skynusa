<?php

namespace App\Mail;

use App\Models\Pesanan;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class OrderCreatedMail extends Mailable
{
    use SerializesModels; // removed Queueable

    public function __construct(
        public Pesanan $pesanan
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name')
            ),
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