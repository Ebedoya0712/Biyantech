<?php

namespace App\Http\Controllers\Admin\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Resources\Course\Coupon\CouponCollection;
use App\Models\Coupon\Coupon;
use App\Models\Coupon\CouponCategorie;
use App\Models\Coupon\CouponCourse;
use App\Models\Course\Categorie;
use App\Models\Course\Course;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $coupons = Coupon::orderBy("id","desc")->get();

        return response()->json(["message" => 200, "coupons" => CouponCollection::make($coupons)]);
    }

    public function config()
    {
        $categories = Categorie::where("categorie_id",NULL)->orderBy("id","desc")->get();

        $courses = Course::where("state",2,NULL)->orderBy("id","desc")->get();

        return response()->json(["categories" => $categories->map(function($categorie){
            return [
                "id" => $categorie->id,
                "name" => $categorie->name,
                "imagen" => env("APP_URL")."storage/".$categorie->imagen
            ];
        }), 
        "courses" => $courses->map(function($course){
            return [
                "id" => $course->id,
                "title" => $course->title,
                "imagen" => env("APP_URL")."storage/".$course->imagen
            ];
        })
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
        $IS_EXISTS = Coupon::where("code",$request->code)->first();
        if($IS_EXISTS){
            return response()->json(["message" => 403,"message_text" => "EL CODIGO DEL CUPON YA EXISTE"]);
        }

        $coupon = Coupon::create($request->all());

        if($request->type_coupon == 1){
            foreach($request->course_selected as $key => $course){
                CouponCourse::create([
                    "coupon_id" => $coupon->id,
                    "course_id" => $course["id"],
                ]);
        }
    }
        
        if($request->type_coupon == 2){
            foreach($request->categorie_selected as $key => $categorie){
                CouponCategorie::create([
                    "coupon_id" => $coupon->id,
                    "categorie_id" => $categorie["id"],
                ]);
            }
        }
            return response()->json(["message" => 200]);
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
        $IS_EXISTS = Coupon::where("id","<>",$id)->where("code",$request->code)->first();
        if($IS_EXISTS){
            return response()->json(["message" => 403,"message_text" => "EL CODIGO DEL CUPON YA EXISTE"]);
        }

        $coupon = Coupon::findOrFail($id);
        
        $coupon->update($request->all());

        foreach($coupon->courses as $key => $courseD){
            $courseD->delete();
        }
        foreach($coupon->categories as $key => $categorieD){
            $categorieD->delete();
        }
        
        if($request->type_coupon == 1){//1 es course
            foreach($request->course_selected as $key => $course){
                CouponCourse::create([
                    "coupon_id" => $coupon->id,
                    "course_id" => $course["id"],
                ]);
        }
    }
        
        if($request->type_coupon == 2){
            foreach($request->categorie_selected as $key => $categorie){
                CouponCategorie::create([
                    "coupon_id" => $coupon->id,
                    "categorie_id" => $categorie["id"],
                ]);
            }
        }
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
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();
        return response()->json(["message" => 200]);
    }
}
