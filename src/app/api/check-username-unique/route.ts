import {z} from 'zod'
import UserModel from '@/model/User'
import dbConnect from '@/lib/dbConnect'
import { usernameValidation } from '@/schemas/signUpSchema'


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

       const result =  usernameQuerySchema.safeParse(queryParam)
       console.log(result);
       if (!result.success) {

    //    const usernameErrors = result.error.format().username?._error || []

      return Response.json({
        succsess : false,
        message: "Invalid query parameter"
      }, {status:400})
       }

       const {username } = result.data
        
    const existingUserAndVerified =    await UserModel.findOne({username, isVerified: true})

    if (existingUserAndVerified) {
        return Response.json({
            succsess : false,
            message: "Username already taken"
          }, {status:400})
           }

           // else 
           return Response.json({
            succsess : true,
            message: "Username is unique"
          }, {status:400})



    
    
       

    } catch (error) {
        console.error("Error while checking the username", error);
        return Response.json({
            success: false,
            message: "Error while checking the username"

        },{
            status: 500
        }
    )
        
    }
}