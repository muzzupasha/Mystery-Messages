'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Message } from "@/model/User"




type MessageCardProps = {
    
    message: Message ,
  
    onMessageDelete: (messageId: string) => void;
  };

  export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const handleDeleteConfirm = async ()=>{
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast(response.data.message)
        onMessageDelete(message._id as any)
      }
      return (
        <Card className="card-bordered">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{message.content}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive'>
                    <X className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this message.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="text-sm">
              
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      );
    }

export default MessageCard