<?php

namespace App\Http\Controllers\Admin\Course;

use App\Http\Controllers\Controller;
use App\Http\Resources\Course\Clases\CourseClaseCollection;
use App\Http\Resources\Course\Clases\CourseClaseResource;
use App\Models\Course\CourseClase;
use App\Models\Course\CourseClaseFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Owenoj\LaravelGetId3\GetId3;
use PhpParser\Builder\Function_;
use Vimeo\Laravel\Facades\Vimeo;

class ClaseGController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $clases = CourseClase::where("course_section_id",$request->course_section_id)->orderBy("id", "asc")->get();

        return response()->json([
            "clases" => CourseClaseCollection::make($clases),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $clase = CourseClase::create($request->all());

        foreach ($request->file("files") as $key => $file) {
            $extension = $file->getClientOriginalExtension();
            $size = $file->getSize();
            $name_file = $file->getClientOriginalName();
            $data = null;
            if(in_array(strtolower($extension),["jpeg","bmp","jpg","png"])){
                $data = getimagesize($file);
            }
            $path = Storage::putFile("clases_files",$file);
            //600 * 400
            $clase_file = CourseClaseFile::create([
                "course_clase_id" => $clase->id,
                "name_file" => $name_file,
                "size" => $size,
                "resolution" => $data ? $data[0]." X ".$data[1] : NULL,
                "file" => $path,
                "type" => $extension,
            ]);
        }

        return response()->json(["clase" => CourseClaseResource::make($clase)]);
    }

    public function upload_video(Request $request, $id)
{
    $time = 0;

    // Obtener duración del video
    $track = new GetId3($request->file('video'));
    $time = $track->getPlaytimeSeconds();

    // Subir a Vimeo
    $response = Vimeo::upload($request->file('video'));

    // Obtener ID del curso
    $course_clase = CourseClase::findOrFail($id);

    // Obtener ID del video
    $vimeo_id = explode("/", $response)[2];

    // Cambiar privacidad del video a público
    Vimeo::request("/videos/" . $vimeo_id, [
        'privacy' => [
            'view' => 'anybody', // Hacer el video público
        ]
    ], 'PATCH');

    // Actualizar curso con ID de Vimeo y duración
    $course_clase->update([
        "vimeo_id" => $vimeo_id,
        "time" => date("H:i:s", $time)
    ]);

    // Responder con el link del reproductor
    return response()->json([
        "link_video" => "https://player.vimeo.com/video/" . $vimeo_id,
    ]);
}

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $clase = CourseClase::findOrFail($id);
        $clase->update($request->all());
        return response()->json(["clase" => CourseClaseResource::make($clase)]);
    }

    public function addFiles(Request $request){
        $clase = CourseClase::findOrFail($request->course_clase_id);
        foreach ($request->file("files") as $key => $file) {
            $extension = $file->getClientOriginalExtension();
            $size = $file->getSize();
            $name_file = $file->getClientOriginalName();
            $data = null;
            if(in_array(strtolower($extension),["jpeg","bmp","jpg","png"])){
                $data = getimagesize($file);
            }
            $path = Storage::putFile("clases_files",$file);
            //600 * 400
            $clase_file = CourseClaseFile::create([
                "course_clase_id" => $clase->id,
                "name_file" => $name_file,
                "size" => $size,
                "resolution" => $data ? $data[0]." X ".$data[1] : NULL,
                "file" => $path,
                "type" => $extension,
            ]);
        }
        return response()->json(["clase" => CourseClaseResource::make($clase)]);
    }

    public function removeFiles($id)
    {
        $course_clase_file = CourseClaseFile::findOrFail($id);
        $course_clase_file->delete();

        return response()->json(["message" => 200]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $clase = CourseClase::findOrFail($id);
        $clase->delete();
        return response()->json(["message" => 200]);
    }
}
