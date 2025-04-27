import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {User} from 'next-auth'



export async function DELETE(request: Request, {params}: {params: {messageid: string}}){
 const messageid =   params.messageid
 await dbConnect()

 const session = await getServerSession(authOptions)

 const user: User = session?.user

 if (!session || !session.user) {
    return Response.json({
        succsess : false,
        message: "Not Authanticated"
      }, {status:404})
 }

   
   try {
   
   const updatedUser = UserModel.updateOne(
    {_id: user._id},
    {$pull: {messages: {_id: messageid}}}
   )

   if ((await updatedUser).modifiedCount == 0) {
    return Response.json({
        succsess : true,
        message: "Message not found or already deleted"
      }, {status:404})
   }
   return Response.json({
    succsess : true,
    message: "Message deleted"


  }, {status:200})

   } catch (error) {
    console.error("error in delete message route: ", error);
    
    return Response.json({
      succsess : false,
      message: "error in delete message route"
    }, {status:500})
   }

}