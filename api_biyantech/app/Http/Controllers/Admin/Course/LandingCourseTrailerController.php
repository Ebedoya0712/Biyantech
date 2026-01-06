<?php

namespace App\Http\Controllers\Admin\Course;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course\LandingCourseTrailer;
use App\Http\Resources\Course\LandingCourseTrailerResource;
use Illuminate\Support\Facades\Storage;
use Vimeo\Laravel\Facades\Vimeo;

class LandingCourseTrailerController extends Controller
{
    public function index()
    {
        $trailer = LandingCourseTrailer::first();
        return response()->json([
            "trailer" => $trailer ? LandingCourseTrailerResource::make($trailer) : null
        ]);
    }

    public function store(Request $request)
    {
        $trailer = LandingCourseTrailer::first();
        $data = $request->all();

        if ($request->hasFile("portada")) {
            if ($trailer && $trailer->getRawOriginal('imagen')) {
                Storage::delete($trailer->getRawOriginal('imagen'));
            }
            $path = Storage::putFile("trailers", $request->file("portada"));
            $data["imagen"] = $path;
        }

        if ($trailer) {
            $trailer->update($data);
        } else {
            $trailer = LandingCourseTrailer::create($data);
        }

        return response()->json([
            "message" => 200,
            "trailer" => LandingCourseTrailerResource::make($trailer)
        ]);
    }

    public function upload_video(Request $request)
    {
        // Obtener ID del tráiler (singleton)
        $trailer = LandingCourseTrailer::first();
        if (!$trailer) {
            $trailer = LandingCourseTrailer::create(["title" => "Nuevo Trailer"]);
        }

        if ($request->hasFile("video")) {
            if ($trailer->vimeo_id) {
                Storage::delete($trailer->vimeo_id);
            }
            $path = Storage::putFile("trailers/videos", $request->file("video"));
            $trailer->update([
                "vimeo_id" => $path
            ]);
        }

        return response()->json([
            "link_video" => url("storage/" . $trailer->vimeo_id),
        ]);
    }
}
