<?php

namespace App\Http\Controllers\Tienda;

use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Models\Course\Course;
use App\Models\Course\Categorie;
use App\Models\Discount\Discount;
use App\Http\Controllers\Controller;
use App\Http\Resources\Ecommerce\Course\CourseHomeResource;
use App\Http\Resources\Ecommerce\Course\CourseHomeCollection;
use App\Http\Resources\Ecommerce\LandigCourse\LandigCourseResource;
use App\Http\Resources\Ecommerce\LandingCourse\LandingCourseResource;

class HomeController extends Controller
{
    public function home(Request $request)
    {
        $categories = Categorie::where("categorie_id",NULL)->withCount("courses")->orderBy("id","desc")->get();
        
        $courses = Course::where("state",2)->inRandomOrder()->limit(3)->get();
        
        $categories_courses = Categorie::where("categorie_id",NULL)->withCount("courses")
                        ->having("courses_count",">",0)
                        ->orderBy("id","desc")->take(5)->get();
        $group_courses_categories = collect([]);

        foreach ($categories_courses as $key => $categories_course) {
            $group_courses_categories->push([
                "id" => $categories_course->id,
                "name" => $categories_course->name,
                "name_empty" => str_replace(" ","",$categories_course->name),
                "courses_count" => $categories_course->courses_count,
                "courses" => CourseHomeCollection::make($categories_course->courses),
            ]);
        }

        date_default_timezone_set("America/Lima");
        $DESCOUNT_BANNER = Discount::where("type_campaing",3)->where("state",1)
                            ->where("start_date","<=",today())
                            ->where("end_date",">=",today())
                            ->first();

        $DESCOUNT_BANNER_COURSES = collect([]);
        if($DESCOUNT_BANNER){
            foreach ($DESCOUNT_BANNER->courses as $key => $course_discount) {
                $DESCOUNT_BANNER_COURSES->push(CourseHomeResource::make($course_discount->course));
            }
        }

        date_default_timezone_set("America/Lima");
        $DESCOUNT_FLASH = Discount::where("type_campaing",2)->where("state",1)
                            ->where("start_date","<=",today())
                            ->where("end_date",">=",today())
                            ->first();

        $DESCOUNT_FLASH_COURSES = collect([]);
        if($DESCOUNT_FLASH){
            $DESCOUNT_FLASH->end_date = Carbon::parse($DESCOUNT_FLASH->end_date)->addDays(1);
            foreach ($DESCOUNT_FLASH->courses as $key => $course_discount) {
                $DESCOUNT_FLASH_COURSES->push(CourseHomeResource::make($course_discount->course));
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

            "DESCOUNT_FLASH" => $DESCOUNT_FLASH ? [
                "id" => $DESCOUNT_FLASH->id,
                "discount" => $DESCOUNT_FLASH->discount,
                "code" => $DESCOUNT_FLASH->code,
                "type_campaing" => $DESCOUNT_FLASH->type_campaing,
                "type_discount" => $DESCOUNT_FLASH->type_discount,
                "end_date" => Carbon::parse($DESCOUNT_FLASH->end_date)->format("Y-m-d"), 
                "start_date_d" =>  Carbon::parse($DESCOUNT_FLASH->start_date)->format("Y/m/d"), 
                "end_date_d" =>  Carbon::parse($DESCOUNT_FLASH->end_date)->subDays(1)->format("Y/m/d"), 
            ] : NULL,
            "DESCOUNT_FLASH_COURSES" => $DESCOUNT_FLASH_COURSES,
        ]);
    }

    public function course_detail(Request $request,$slug)
    {
        $campaing_discount = $request->get("campaing_discount");
        $discount = null;
        if($campaing_discount){
            $discount = Discount::findOrFail($campaing_discount);
        }
        $course = Course::where("slug",$slug)->first();
        if(!$course){
            return abort(404);
        }
        $courses_related_instructor = Course::where("id","<>",$course->id)->where("user_id",$course->user_id)->inRandomOrder()->take(2)->get();

        $courses_related_categories = Course::where("id","<>",$course->id)->where("categorie_id",$course->categorie_id)->inRandomOrder()->take(3)->get();

        return response()->json([
            "course" => LandigCourseResource::make($course),
            "courses_related_instructor" => $courses_related_instructor->map(function($course){
                return CourseHomeResource::make($course);
            }),
            "courses_related_categories" => $courses_related_categories->map(function($course){
                return CourseHomeResource::make($course);
            }),
            "DISCOUNT" => $discount,
        ]);
    }
}
