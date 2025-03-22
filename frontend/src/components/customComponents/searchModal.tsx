import axios from 'axios';
import React from 'react'

type Props = {
    user:any;
}


const addFriend = async(user:any)=>{
    try {
        const res = axios.get(`${import.meta.env.VITE_URL}/api/chat/create-chat`)
    } catch (error) {
        
    }
}
function SearchModal({user}: Props) {
  return (
    <div>
        {
            user.map(()=>{
                return(
                    <div className='p-2'>
                        {user.username}
                        <button onClick={()=>addFriend(user)}>+</button>
                    </div>
                )
            })
        }
    </div>
  )
}

export default SearchModal