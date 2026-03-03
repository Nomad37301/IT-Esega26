<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TimelineRequest;
use App\Http\Resources\TimelineResource;
use App\Models\Timeline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class TimelineController extends Controller
{
    public function index()
    {
        $timelines = Timeline::latest()->paginate(10);

        return Inertia::render('admin/timeline/index', [
            'timelines' => TimelineResource::collection($timelines),
        ]);
    }

    public function store(TimelineRequest $request)
    {

        // dd($request->all());
        $validated = $request->validated();

        try {
            Timeline::create($validated);
            Session::flash('success', "Timeline berhasil ditambahkan.");
        } catch (\Exception $e) {
            Session::flash('error', "Gagal menambahkan timeline: " . $e->getMessage());
        }

        return to_route('timeline.index');
    }

    public function update(TimelineRequest $request, $id)
    {
        try {
            $timeline = Timeline::findOrFail($id);
            $validated = $request->validated();

            $timeline->update($validated);
            Session::flash('success', "Timeline berhasil diperbaharui.");
        } catch (\Exception $e) {
            Session::flash('error', "Gagal memperbarui timeline: " . $e->getMessage());
        }

        return to_route('timeline.index');
    }

    public function destroy($id)
    {
        try {
            $timeline = Timeline::findOrFail($id);
            $timeline->delete();

            Session::flash('success', "Timeline berhasil dihapus.");
        } catch (\Exception $e) {
            Session::flash('error', "Gagal menghapus timeline: " . $e->getMessage());
        }

        return to_route('timeline.index');
    }
}