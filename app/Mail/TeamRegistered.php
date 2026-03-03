<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TeamRegistered extends Mailable
{
    use Queueable, SerializesModels;

    public $teamName;
    public $gameType;
    public $email;
    public $URL;

    /**
     * Create a new message instance.
     */
    public function __construct($teamName, $gameType, $email, $URL)
    {
        $this->teamName = $teamName;
        $this->gameType = $gameType;
        $this->email = $email;
        $this->URL = $URL;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Registrasi Tim ' . $this->teamName . ' Berhasil',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.team_registered',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
