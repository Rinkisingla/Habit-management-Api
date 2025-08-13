import mongoose, {Schema} from "mongoose"
const HabitSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    goalType:{
        type:String,
        enum: ['daily', 'monthly', 'weekley']
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
},{timestamps:true})
 export const Habit = mongoose.model("Habit", HabitSchema)