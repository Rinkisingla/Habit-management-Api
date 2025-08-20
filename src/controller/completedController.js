import asyncHandler from "../utils/AsyncHandler.js"
 import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { Habit } from "../models/Habitmodels.js"
import { Completed } from "../models/completedmodels.js"
import dayjs from "dayjs"
import mongoose from "mongoose"
 
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

  const dashboard = asyncHandler(async(req,res)=>{
     const userId= req.user.id
      if(!mongoose.Types.ObjectId.isValid(userId)){
         throw new ApiError(400, "Not the valid user")
      }
      const userHabit = await Habit.find({userId:userId});
       const dashboard=[];
        for(const habit of userHabit){
           const completion =await Completed.find({habitId:habit}).sort({createdAt:1});

            const startday= dayjs(habit.createdAt);
            const today = dayjs();
             let  totalperiod;
            if(habit.goalType==='daily'){
                totalperiod = today.diff(startday, "day") + 1;
            }else if(habit.goalType==='weekley'){
                 totalperiod = today.diff(startday, "weekly")+1;
            }else if(habit.goalType==='monthly'){
                 totalperiod = today.diff(startday, "monthly")+1;
            }
            const completedPeriods = new Set();
             completion.forEach(c=>{
               if(habit.goalType==='daily'){
                completedPeriods.add(dayjs(c.date).format("YYYY-MM-DD"));
            }else if(habit.goalType==='weekley'){
                 completedPeriods.add(dayjs(c.date).format("YYYY-[W]WW"));
            }else if(habit.goalType==='monthly'){
                 completedPeriods.add(dayjs(c.date).format("YYYY-MM"));
            }
             })
              const completedsize = completedPeriods.size;
               const completedRate = ((completedsize/totalperiod)*100).toFixed(0) + "%";
               const streakDates = Array.from(completedPeriods).sort();
               const { currentStreak, longestStreak } = calculateStreaks(streakDates, habit.goalType);
             dashboard.push({
        habitId: habit._id,
        title: habit.title,
        goalType: habit.goalType,
        totalperiod,
        completedPeriods: completedsize,
        completedRate,
        currentStreak,
        longestStreak
      });
        }
       res.status(200).json(new ApiResponse( 200, { user: { id: userId }, dashboard }, "All the habits of the user"))
  })
  export {progress, track, dashboard}
  function calculateStreaks(completions, goalType) {
  if (!completions.length) return { currentStreak: 0, longestStreak: 0 };

  // Ensure ascending order
  completions = completions.sort((a, b) => new Date(a) - new Date(b));

  const unit = goalType === "daily" ? "day" : goalType === "weekly" ? "week" : "month";

  let currentStreak = 0, longestStreak = 0;
  let prev = null;

  completions.forEach(date => {
    if (!prev) {
      currentStreak = 1;
    } else {
      const diff = dayjs(date).diff(dayjs(prev), unit);
      if (diff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
    prev = date;
  });

  longestStreak = Math.max(longestStreak, currentStreak);

  return { currentStreak, longestStreak };
}
