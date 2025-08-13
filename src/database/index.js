 import mongoose from "mongoose"


 const connectdb=  async () => {
     try {
         const connect = await mongoose.connect(`${process.env.MONGODBURL}/${process.env.DB_NAME}`)
         console.log("Connection String", connect.connection.host)
     } catch (error) {
         console.log("MongoDb connection error", error)
         process.exit(1); 
     }
    
 }
 export default connectdb