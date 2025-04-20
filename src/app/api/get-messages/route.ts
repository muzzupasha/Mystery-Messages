import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth'
import mongoose from "mongoose";


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

   const userId = new mongoose.Types.ObjectId(user._id);
   
   try {
    const user = await UserModel.aggregate([
        {$match: {id: userId}},
        {$unwind: '$messages'},
        {$sort: {"messages.createdAt": -1}},
        {$group: {_id: '$_id', messages: {$push:
            '$messages'
        }}}
    ])

    if (!user || user.length === 0 ) {
        return Response.json({
            succsess : false,
            message: "User not found"
          }, {status:404})
    }

    return Response.json({
        succsess : true,
        message: user[0].messages
      }, {status:404})
      
   } catch (error) {
    console.error("An unexpected error occured: ", error);
    
    return Response.json({
      succsess : false,
      message: "An unexpected error occured"
    }, {status:500})
   }

}