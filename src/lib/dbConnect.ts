import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject =  {}

async function dbConnect(): Promise<void>{
    if (connection.isConnected) {
        console.log("Already connected to databse!!");
        return
    }

    try {
        const db =  await mongoose.connect(process.env.MONGODB_URI || '' , {})
  
          connection.isConnected = db.connections[0].readyState
  
          console.log("Bhai database successfully connected!");
          
      } catch (error) {
          console.log("Bhaiyye database connection failed ho gaya!", error);
          process.exit(1)
      }  
      
    }  

    export default dbConnect
  


        
 
