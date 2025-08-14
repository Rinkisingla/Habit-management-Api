import asyncHandler from "../utils/AsyncHandler.js"
 import {UserValidation} from '../validation/uservalidation.js'
 import ApiError from "../utils/ApiError.js"
import User from "../models/Usermodels.js"
import ApiResponse from "../utils/ApiResponse.js"
 const generrateAccessAndTefreshToken = async (Userid) => {
     try {
        const user =  await User.findById(Userid);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken= refreshToken;
         await user.save({validateBeforeSave:false})
          return{accessToken, refreshToken};
     } catch (error) {
         throw  new ApiError(500, error)
     }

    
 }


 const userRegister = asyncHandler(async(req, res)=>{
     const result = UserValidation.safeParse(req.body);
      if(!result.success){
         const  message =result.error.issues.map(error=>error.message)
           throw new ApiError(400, message.join(", ")||"Ivalid details")
      }
       const {username, fullname, email, password}= result.data;
       const existinguser = await User.findOne({$or: [{username},{email}]})
     if(existinguser){
            throw new ApiError(409, "This user is already exist please create something new")
     }
     const user =  await User.create({username, fullname, email, password})
      const finduser = await User.findById(user._id).select("-passsword -refreshToken");
      if(!finduser){
         throw new ApiError(404, "there is error in creating the user")
      }
       res.status(200).json( new ApiResponse( 201,{ user: finduser},"User has been created successfully"))

 })
  const loginUser = asyncHandler(async (req, res)=>{
     const  {email, password}= req.body;
      if(!email?.trim()||!password?.trim()){
        throw  new ApiError (400, "Enter the valid inputs");
      }
      const user  = await User.findOne({email}).select('+password');
      if(!user){
             throw  new ApiError (404, " This user does not exists");
      }
     const isPasswordValid = await user.isPasswordValid(password);
      if(!isPasswordValid){
             throw  new ApiError (409, "Invalid Credetionals");
      }
    const {refreshToken, accessToken}=   await generrateAccessAndTefreshToken(user._id);
    console.log(refreshToken, accessToken);
    const options={
        Httponly:true,
        secure:true,
    }
     res.status(200).cookie("Accesstoken",accessToken,options).
     cookie( "RefreshToken",  refreshToken, options).json(
        new ApiResponse(200,
          {user: user, accessToken, refreshToken},"loggedin user successfully"

     )
    )
  })
  export {userRegister, loginUser}