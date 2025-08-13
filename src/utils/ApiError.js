class ApiError extends Error{
    constructor(statuscode, message="Something went wrong" , error=[], stack){
         this.statuscode= statuscode,
         this.error= error,
         this.message=message,
         this.data=null,
         this.sucess=false;
          if(stack){
            this.stack=stack
          }
          else{
                Error.captureStackTrace(this, this.constructor)
          }
    }
}
 export default ApiError
    
