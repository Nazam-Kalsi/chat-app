import React from 'react'

type Props = {}

function Loading({}: Props) {
  return (
    <div className='absolute bg-black/50 border h-screen w-screen flex justify-center items-center gap-1'>
    <div className="loader border-r-2 rounded-full border-yellow-500 bg-yellow-300 animate-bounce  aspect-square w-8  flex justify-center items-center text-yellow-700"></div>
    <div className="loader border-r-2 rounded-full border-yellow-500 bg-yellow-300 animate-bounce delay-150 aspect-square w-8  flex justify-center items-center text-yellow-700"></div>
    <div className="loader border-r-2 rounded-full border-yellow-500 bg-yellow-300 animate-bounce aspect-square w-8  flex justify-center items-center text-yellow-700"></div>
</div>
  )
}

export default Loading;