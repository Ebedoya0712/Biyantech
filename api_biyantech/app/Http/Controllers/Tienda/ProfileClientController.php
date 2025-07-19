<?php

namespace App\Http\Controllers\Tienda;

use App\Models\User;
use App\Models\Sale\Sale;
use Illuminate\Http\Request;
use App\Models\CoursesStudent;
use App\Models\Sale\SaleDetail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Resources\Ecommerce\Sale\SaleCollection;
use App\Http\Resources\Ecommerce\Course\CourseHomeResource;

class ProfileClientController extends Controller
{

    public function profile(Request $request)
    {
        $user = auth('api')->user();

        $enrolled_course_count = CoursesStudent::where("user_id",$user->id)->count();
        $active_course_count = CoursesStudent::where("user_id",$user->id)->where("clases_checkeds","<>",NULL)->count();
        $termined_course_count = CoursesStudent::where("user_id",$user->id)->where("state",2)->count();

        $enrolled_courses = CoursesStudent::where("user_id",$user->id)->get();
        $active_courses = CoursesStudent::where("user_id",$user->id)->where("clases_checkeds","<>",NULL)->get();
        $termined_courses = CoursesStudent::where("user_id",$user->id)->where("state",2)->get();

        $sale_details = SaleDetail::whereHas("sale",function($q) use($user){
            $q->where("user_id",$user->id);
        })->orderBy("id","desc")->get();

        $sales = Sale::where("user_id",$user->id)->orderBy("id","desc")->get();
        return response()->json([
            "user" => [
                "name" => $user->name,
                "surname" => $user->surname ?? '',
                "email" => $user->email,
                "phone" => $user->phone,
                "profesion" =>$user->profesion,
                "description" =>$user->description,
                "avatar" => env("APP_URL")."storage/".$user->avatar,
            ],
            "enrolled_course_count" => $enrolled_course_count,
            "active_course_count" => $active_course_count,
            "termined_course_count" => $termined_course_count,
            "enrolled_courses" => $enrolled_courses->map(function($course_student){
                $clases_checkeds = $course_student->clases_checkeds ? explode(",",$course_student->clases_checkeds) : [];
                return [
                    "id" => $course_student->id,
                    "clases_checkeds" => $clases_checkeds,
                    "percentage" => $course_student->course->count_class > 0 ? 
                        round((sizeof($clases_checkeds) / $course_student->course->count_class) * 100, 2) : 
                    0,

                    "course" => CourseHomeResource::make($course_student->course),
                ];
            }),
            "active_courses" => $active_courses->map(function($course_student){
                $clases_checkeds = $course_student->clases_checkeds ? explode(",",$course_student->clases_checkeds) : [];
                return [
                    "id" => $course_student->id,
                    "clases_checkeds" => $clases_checkeds,
                    "percentage" => $course_student->course->count_class > 0 ? 
                    round((sizeof($clases_checkeds) / $course_student->course->count_class) * 100, 2) : 
                0,

                    "course" => CourseHomeResource::make($course_student->course),
                ];
            }),
            "termined_courses" => $termined_courses->map(function($course_student){
                $clases_checkeds = $course_student->clases_checkeds ? explode(",",$course_student->clases_checkeds) : [];
                return [
                    "id" => $course_student->id,
                    "clases_checkeds" => $clases_checkeds,
                    "percentage" => $course_student->course->count_class > 0 ? 
                        round((sizeof($clases_checkeds) / $course_student->course->count_class) * 100, 2) : 
                    0,

                    "course" => CourseHomeResource::make($course_student->course),
                ];
            }),
            "sale_details" => $sale_details->map(function($sale_detail){
                return [
                    "id" => $sale_detail->id,
                    "review" => $sale_detail->review,
                    "course" => [
                        "id" => $sale_detail->course->id,
                        "title" => $sale_detail->course->title,
                        "imagen" => env("APP_URL")."storage/".$sale_detail->course->imagen,
                    ],
                    "created_at" => $sale_detail->created_at->format("Y-m-d h:i:s"),
                ];
            }),
            "sales" => SaleCollection::make($sales),
        ]);
    }
    

    public function update_client(Request $request)
    {
        $user = User::findOrFail(auth("api")->user()->id);
        if($request->new_password){
            $request->request->add(["password" => Hash::make($request->new_password)]);
        }
        
        if($request->hasFile("imagen")){
            if($user->avatar){
                Storage::delete($user->avatar);
            }
            $path = Storage::putFile("users",$request->file("imagen"));
            $request->request->add(["avatar" => $path]);
        }
        
        $user->update($request->all());

        return response()->json(["message" => 200]);
    }

    // --- AÑADE ESTE NUEVO MÉTODO ---
    public function downloadCertificate(Request $request, $course_student_id)
    {
        // Buscamos la inscripción del curso
        $course_student = CoursesStudent::findOrFail($course_student_id);

        // Verificación de seguridad: el certificado solo lo puede descargar el dueño del curso
        if ($course_student->user_id != auth('api')->user()->id) {
            return response()->json(["message" => "No tienes permiso para descargar este certificado"], 403);
        }

        // Verificación de estado: el curso debe estar completado (state = 2)
        if ($course_student->state != 2) {
             return response()->json(["message" => "Debes completar el curso para descargar el certificado"], 403);
        }

        // Pasamos los datos del estudiante y del curso a una vista de Blade
        $data = [
            "user" => $course_student->user,
            "course" => $course_student->course,
        ];

        // Generamos el PDF desde una vista de Blade llamada 'certificate-template'
        // Debes crear este archivo en resources/views/certificate-template.blade.php
        $pdf = PDF::loadView('certificate-template', $data)->setPaper('a4', 'landscape');
        
        // Enviamos el PDF para que se descargue en el navegador
        return $pdf->download('certificado-'.$course_student->course->slug.'.pdf');
    }
}
