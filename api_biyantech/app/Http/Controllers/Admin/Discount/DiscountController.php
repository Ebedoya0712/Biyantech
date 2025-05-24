<?php

namespace App\Http\Controllers\Admin\Discount;

use App\Http\Controllers\Controller;
use App\Http\Resources\Discount\DiscountCollection;
use App\Models\Discount\Discount;
use App\Models\Discount\DiscountCategorie;
use App\Models\Discount\DiscountCourse;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $state = $request->state;
        //filterAdvance($search,$state)->
        $discounts = Discount::orderBy("id","desc")->get();

        return response()->json(["message" => 200, "discounts" => DiscountCollection::make($discounts)]);
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
        
        if($IS_EXISTS){
            return response()->json(["message" => 403,"message_text" => "EL CODIGO DEL CUPON YA EXISTE"]);
        }

        $request->request->add(["code" => uniqid()]);
        $discount = Discount::create($request->all());

        if($request->type_discount == 1){
            foreach($request->course_selected as $key => $course){
                DiscountCourse::create([
                    "discount_id" => $discount->id,
                    "course_id" => $course["id"],
                ]);
        }
    }
        
        if($request->type_discount == 2){
            foreach($request->categorie_selected as $key => $categorie){
                DiscountCategorie::create([
                    "discount_id" => $discount->id,
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
