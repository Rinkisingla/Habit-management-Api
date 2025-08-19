import asyncHandler from "../utils/AsyncHandler.js"
 import ApiError from "../utils/ApiError.js"

import ApiResponse from "../utils/ApiResponse.js"
import { Habit } from "../models/Habitmodels.js"
import { habitvalidation } from "../validation/habitvalidation.js"
import mongoose from "mongoose"
// POST /habits → Add new habit (title, goalType: daily/weekly/monthly)
// GET /habits → List all habits for a user
// PATCH /habits/:id → Edit habit
// DELETE /habits/:id → Delete habit
  const newhabit= asyncHandler(async(req, res)=>{
            
          const payload = {
             userId : req.user.id,
               ... req.body
          }
          console.log(payload);
           const result = habitvalidation.safeParse(payload)
            if(!result.success){
                  const message = result.error.issues.map(error=>error.message)
                  throw  new ApiError(400, message.join(", ") ||"Invalid Input");
            }
             console.log(result);
            const {userId, title, goalType, createdAt} = result.data;
             const existingHabit =  await Habit.findOne({$and:[{title},{createdAt}, {userId} ]})
             if(existingHabit)
             {
                  throw  new ApiError(409, "This habit is already register");

             }
              const habit = await Habit.create({userId, title, goalType, createdAt})
            if(!habit)
             {
                  throw  new ApiError(409, "Error in creating the error");
             }
              res.status(201).json( new ApiResponse( 201, {Habit: habit}, "Habit has been created successfully"))


  })
//   / GET /habits → List all habits for a user
 const allHabit = asyncHandler(async(req, res)=>{

     const userId= req.user.id;
      if(!mongoose.Types.ObjectId.isValid(userId)){
          throw new ApiError(400, "Ivalid id")
      }
      const habits =  await Habit.find({userId})
       if(habits.length===0){
        throw new ApiError(404, "Error in fecthing the  habits")
       } 
        res.status(200).json( new ApiResponse(200, habits , "All habits of the  user  are fetched successfully"));


 })
  const deletehabits= asyncHandler(async(req,res)=>{
    // DELETE /habits/:id → Delete habit
     const {id} = req.params
     if(!mongoose.Types.ObjectId.isValid(id)){
          throw new ApiError(400, "Ivalid id")
      }
      const habits =  await Habit.findByIdAndDelete(id)
       
       if(!habits){
         throw new ApiError(409, "error in deleting the habit")
       }
        res.status(200).json(new ApiResponse(200, habits,"this habit has been deleted"))


  })
 const  gethabit= asyncHandler(async(req, res)=>{
     const id= req.user.id
     if(!mongoose.Types.ObjectId.isValid(id)){
       throw new ApiError(401, "Enter the valid id");
     }
      const getallhabits = await Habit.find({userId:id})
      console.log(getallhabits);
      if(getallhabits.length===0){
          throw new ApiError(404, "there is error in fetching all the habits of the user");
      }
      res.status(200).json(new ApiResponse(200,getallhabits," All th habits of the user are fetched"));
 }) 
export  {newhabit, allHabit, deletehabits, gethabit}
