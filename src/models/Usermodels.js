import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
 const UserSchema =  new Schema({
    username:{
         type:String,
         required:true,
         lowercase:true,
         unique:true,
    },
    fullname:{
         type:String,
         required:true,
    },
    email:{
         type:String,
         required:true,  
         unique:true
    },
     password:{
         type:String,
         required:true,  
         select:false
     },
     refreshToken:{
        type:String,
        default:""
     }
 },{timestamps:true})
 

  UserSchema.pre("save", async function (next) {
     if(!this.isModified("password"))return next();
     const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt)
  })
  UserSchema.methods.ispasswordvalid = async function (password) {
    return await bcrypt.compare(password,this.password)
  }
  UserSchema.methods.generateaccesstoken = function () {
    return jwt.sign(
        {
            id: this._id,
            username:this.username,
            fullname:this.fullname,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.AccessTokenExpireIn
        }

    )
  }
  UserSchema.methods.generaterefreshtoken = function () {
    return jwt.sign(
        {
            id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.RefreshTokenExpireIn
        }

    )
  }
   export const User = mongoose.model("User", UserSchema)
   