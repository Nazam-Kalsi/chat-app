import React from 'react'
import { useUser } from '@/context/session'
type MessageContainerProps = {
    message : any;
    isGroup?:boolean;
}
function MessageContainer({message, isGroup}:MessageContainerProps) {

  const {user} = useUser() as { user: { _id: string } | null };
  if(!user)console.log('first login...');

  return (
    <>
    <p className='text-sm text-gray-600 text-start w-full' >{isGroup&& message.sender}</p>
        <div className={`max-w-1/2 my-1 mx-4 ${message.sender == user?._id ? "self-end rounded-ee-xl rounded-s-xl" : "self-start rounded-e-xl rounded-es-xl"} flex flex-col leading-1.5 px-4 py-2 border-gray-200 bg-gray-200 border-1 dark:border-none dark:bg-gray-700`}>
      <p className="text-wrap text-sm font-normal text-gray-900 dark:text-white">{message.message}</p>
      <div className="flex items-center justify-end w-full space-x-2 rtl:space-x-reverse">
         <span className="text-xs font-normal text-gray-500 dark:text-gray-400">11:46</span>
      </div>
   </div>
    </>
  )
}

export default MessageContainer