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
      next();
  })
  UserSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password,this.password)
  }
  UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            username:this.username,
            
        },
        process.env.Access_Token_SecretKey,
        {
            expiresIn: process.env.AccessTokenExpireIn
        }

    )
  }
  UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            
        },
        process.env.Refresh_Token_SecretKey,
        {
            expiresIn: process.env.RefreshTokenExpireIn
        }

    )
  }
   const User = mongoose.model("User", UserSchema);
export default User;
   