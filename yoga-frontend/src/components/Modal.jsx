import { Close } from '@mui/icons-material'
import React from 'react'

const Modal = ({children}) => {
  return (
    <div className='fixed top-0 left-0 w-screen h-screen z-[9999] bg-black/60 flex justify-center items-center backdrop-blur'>
        <div className=' bg-white w-full h-full sm:w-[500px] sm:h-[500px] p-8 overflow-y-scroll rounded-md '>
        
              {
                children
              }  
        </div>
    </div>
  )
}

export default Modal