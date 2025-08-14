 import ApiError from "../utils/ApiError.js"
import User from "../models/Usermodels.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/AsyncHandler.js"

const verifyjwt = asyncHandler(async(req, res, next)=>{
    try {
         const token =  req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim();
          if(!token)
          {
            throw new ApiError(400, "TOKEN NOT FOUND");
          }
           const decodedToken= jwt.verify(token, process.env.Access_Token_SecretKey)
            if(!decodedToken)
            {
                throw new ApiError(409, "Token did not matched");
            }
             const user =await  findById(decodedToken.id);
            if(!user){
                 throw new ApiError(404, "User not found");
            }
             req.user= user;
        
         next();
    } catch (error) {
          throw new ApiError(402,error?.message ||"invalid access token");
    }

})
 export default verifyjwt