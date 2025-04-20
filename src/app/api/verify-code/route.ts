import UserModel from '@/model/User'
import dbConnect from '@/lib/dbConnect'

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username , code} = await request.json()
       const decodedUsername =  decodeURIComponent(username)

      const user =  await UserModel.findOne({username: decodedUsername})
      
      if (!user) {
        return Response.json({
            succsess : false,
            message: "User not found"
          }, {status:500})
      }

      const isCodeValid = user.verifyCode === code
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

      if (isCodeValid && isCodeNotExpired) {
        user.isVerified = true
       await user.save()
        
       return Response.json({
        succsess : true,
        message: "Account veified successfully"
      }, {status:200})

      }else if (!isCodeNotExpired){
        return Response.json({
            succsess : false,
            message: "verify code has been expired please signup again to get an new code"
          }, {status:400})
    
      } else {
        return Response.json({
            succsess : false,
            message: "Incorrect verification code"
          }, {status:405})
      }

    } catch (error) {
        console.error("Error while verifying user", error);
        return Response.json({
            success: false,
            message: "Error while verifying user"

        },{
            status: 500
        }
    )
    }
}