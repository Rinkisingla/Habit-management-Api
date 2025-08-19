import mongoose, {Schema, Types} from "mongoose"
 const CompletedSchema = new Schema({
    habitId:{
        type:Schema.Types.ObjectId,
        ref:"Habit",
        required:true
    },
    date: { 
        type: Date, 
        required: true ,
         set: (val) => new Date(new Date(val).setHours(0, 0, 0, 0)),
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

 }, {timestamps:true})
   CompletedSchema.index({ habitId: 1, date: 1 }, { unique: true });
  export  const Completed = mongoose.model("Completed",CompletedSchema )