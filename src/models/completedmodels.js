import mongoose, {Schema, Types} from "mongoose"
 const CompletedSchema = new Schema({
    habitId:{
        type:Schema.Types.ObjectId,
        ref:"Habit",
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    }
 }, {timestamps:true})
  export  const Completed = mongoose.model("Completed",CompletedSchema )