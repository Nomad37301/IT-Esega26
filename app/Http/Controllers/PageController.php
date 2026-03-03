<?php

namespace App\Http\Controllers;

use App\Http\Resources\TimelineResource;
use App\Models\Timeline;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Show the about page.
     */
    public function about(): Response
    {
        return Inertia::render('about');
    }

    public function home(): Response
    {

        $event = Timeline::all();
        return Inertia::render('home', [
            'event' => TimelineResource::collection($event),
        ]);
    }

    /**
     * Show the FAQ page.
     */
    public function faq(): Response
    {
        return Inertia::render('FAQ');
    }

    /**
     * Show the contact page.
     */
    public function contact(): Response
    {
        return Inertia::render('Contact');
    }
}