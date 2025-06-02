<?php

namespace App\Http\Controllers\Tienda;

use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Course\CourseHomeCollection;
use App\Http\Resources\Ecommerce\Course\CourseHomeResource;
use App\Models\Course\Categorie;
use App\Models\Course\Course;
use App\Models\Discount\Discount;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function home(Request $request)
    {
        $categories = Categorie::where("categorie_id",NULL)->withCount("courses")->orderBy("id", "desc")->get();

        $courses = Course::where("state",2)->inRandomOrder()->limit(3)->get();

        $categories_courses = Categorie::where("categorie_id",NULL)->withCount("courses")
                        ->having("courses_count",">",0)
                        ->orderBy("id", "desc")->take(5)->get();
        $group_courses_categories = collect([]);

        foreach ($categories_courses as $key => $categories_course){
            $group_courses_categories->push([
                "id" => $categories_course->id,
                "name" => $categories_course->name,
                "name_empty" => str_replace(" ", "", $categories_course->name),
                "courses_count" => $categories_course->courses_count,
                "courses" => CourseHomeCollection::make($categories_course->courses),
            ]);
        }

        date_default_timezone_set("America/Caracas");
        $DESCOUNT_BANNER = Discount::where("type_campaing", 3)->where("state",1)
                        ->where("start_date","<=",today())
                        ->where("end_date",">=",today())
                        ->first();
        
        $DESCOUNT_BANNER_COURSES = collect([]);
        if($DESCOUNT_BANNER){
            foreach ($DESCOUNT_BANNER->courses as $key => $course_discount){
                $DESCOUNT_BANNER_COURSES->push(CourseHomeResource::make($course_discount->course));
            }
        }
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
            "group_courses_categories" => $group_courses_categories,
            "DESCOUNT_BANNER" => $DESCOUNT_BANNER,
            "DESCOUNT_BANNER_COURSES" => $DESCOUNT_BANNER_COURSES,
        ]);
    }
}
