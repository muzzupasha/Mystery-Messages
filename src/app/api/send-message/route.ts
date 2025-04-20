import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { use } from "react";

export async function POST(request: Request){
 await dbConnect()

 const {username , content} = await request.json()

 try {
   const user = await  UserModel.findOne({username})

   if(!user){
 return Response.json({
        succsess : false,
        message: "user not found"
      }, {status:404})
   }

   // check the user accept the messages or not 

   if (!user.isAcceptingMessages) {
    return Response.json({
        succsess : false,
        message: "User is not accepting the messages"
      }, {status:403})
   }

   const newMessage = {content , createdAt: new Date()}
   user.messages.push(newMessage as Message)
   await user.save()

   return Response.json({
    succsess : true,
    message: "Message sent successfully"
  }, {status:200})

 } catch (error) {
    console.error("Error adding messages", error);
    
    return Response.json({
        succsess : false,
        message: "Internal server error"
      }, {status:500})
     
 }
}
