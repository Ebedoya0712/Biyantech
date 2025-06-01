<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Course\CourseHomeCollection;
use App\Models\Course\Categorie;
use App\Models\Course\Course;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function home(Request $request)
    {
        $categories = Categorie::where("categorie_id",NULL)->withCount("courses")->orderBy("id", "desc")->get();

        $courses = Course::where("state",2)->inRandomOrder()->limit(3)->get();

        return response()->json([
            "categories" => $categories->map(function($categorie){
                return [
                    "id" => $categorie->id,
                    "name" => $categorie->name,
                    "imagen" => env("APP_URL")."storage/".$categorie->imagen,
                    "course_count" => $categorie->courses_count,
                ];
            }),
            "courses_home" => CourseHomeCollection::make($courses),
        ]);
    }
}
