import asyncHandler from "../utils/AsyncHandler.js"
 import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { Habit } from "../models/Habitmodels.js"
import { Completed } from "../models/completedmodels.js"
import dayjs from "dayjs"
 
 const progress= asyncHandler(async(req, res)=>{
     const { id: habitId } = req.params;
      let { date } = req.body;
    date = date ? dayjs(date).startOf("day").toDate() : dayjs().startOf("day").toDate();

         const userId= req.user.id;
         
         const habit= await  Habit.findById(habitId);
         console.log( "id", userId ,  habit.userId);
          if (!habit || habit.userId.toString() !== userId) {
                    throw new ApiError(400, "Habit does not belong to this user");
                    }
         const Completedhabit = await Completed.create({habitId, date})
          if(!Completedhabit){
             throw new ApiError(402, "Already marked for this date",Error);
          }
           res.status(200).json(
             new ApiResponse( 200, Completedhabit, "this habit is completed for today")
           )


 })
  const track = asyncHandler(async(req,res)=>{
    const{id: habitId}= req.params
    const {from , to}= req.query
     const fromdate = from ? dayjs(from).startOf("day"): dayjs().startOf("month");
     const todate = to ? dayjs(to).endOf("day"): dayjs().endOf("month");
      const userId= req.user.id;
       const habit = await Habit.findById(habitId);
        console.log("user id", userId,"habit", habit.userId.toString())
        if (!habit) {
            throw new ApiError(404, "Habit not found");
            }

        if (habit.userId.toString() !== userId) {
            throw new ApiError(403, "This habit does not belong to the user");
            }
        const Completedhabit= await Completed.find({habitId, 
            date:{$gte: fromdate.toDate() , $lte:todate.toDate()}
        }).sort({date:1});
 
   const totaldays = todate.diff(fromdate, "day")+1;
    const completeddays= Completedhabit.length;
     const completionRate =  ((completeddays/totaldays)*100).toFixed(1) + "%";;
      res.status(200).json( new ApiResponse( 200,{habitId,
        from: fromdate.format("YYYY-MM-DD"),
        to: todate.format("YYYY-MM-DD"),
        totaldays,
        completeddays,
        completionRate,
        Completedhabit: Completedhabit.map((c) =>
          dayjs(c.date).format("YYYY-MM-DD")
        ),} ,"progesss tack of the habit"))
 })
  export {progress, track}