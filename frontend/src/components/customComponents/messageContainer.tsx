import React from 'react'
import { useUser } from '@/context/session'
type MessageContainerProps = {
    message : any;
}
function MessageContainer({message}:MessageContainerProps) {

  const {user} = useUser() as { user: { _id: string } | null };
  if(!user)console.log('first login...');

  return (
    <div className={`rounded-md p-2 max-w-24 m-4 ${message.sender === user?._id ? "self-start" : "self-end"}`}>
        {message.message}
    </div>
  )
}

export default MessageContainer