import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth'


export async function POST(request: Request){
 await dbConnect()

 const session = await getServerSession(authOptions)

 const user: User = session?.user

 if (!session || !session.user) {
    return Response.json({
        succsess : false,
        message: "Not Authanticated"
      }, {status:404})
 }

   const userId = user._id
   const {acceptMessages} = await request.json()

   try {
   const updatedUser =  await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessages: acceptMessages},
        {new: true}
    )

    if (!updatedUser) {
        return Response.json({
            succsess : false,
            message:"faild to update the user status to accept messages"
          }, {status:401})
    }

    return Response.json({
        succsess : true,
        message:"Message acceptance status updated successfully",
        updatedUser
      }, {status:200})

   } catch (error) {
    console.error("faild to update the user status to accept messages:", error );
    
    return Response.json({
        succsess : false,
        message:"faild to update the user status to accept messages"
      }, {status:401})
    
   }

}


export async function GET(request: Request){
    await dbConnect()
   
    const session = await getServerSession(authOptions)
   
    const user: User = session?.user
   
    if (!session || !session.user) {
       return Response.json({
           succsess : false,
           message: "Not Authanticated"
         }, {status:404})
    }
   
      const userId = user._id

      try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                succsess : false,
                message:"User not found"
              }, {status:404})
        }

        return Response.json({
            succsess : true,
            isAcceptingMessages: foundUser.isAcceptingMessages
          }, {status:200})

    
      } catch (error) {
        console.error("faild to update the user status to accept messages:", error );
    
        return Response.json({
            succsess : false,
            message:"Errpr in getting message acceptence status"
          }, {status:401})
        
      }

}