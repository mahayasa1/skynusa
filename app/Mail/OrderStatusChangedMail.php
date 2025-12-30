<?php

namespace App\Mail;

use App\Models\Pesanan;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusChangedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Pesanan $pesanan
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Update Status Pesanan - ' . $this->pesanan->code,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.orders.status-changed',
            with: [
                'pesanan' => $this->pesanan,
                'trackingUrl' => route('order.tracking') . '?code=' . $this->pesanan->code,
            ],
        );
    }
}
