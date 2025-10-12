import React from 'react'

const ConfirmationPopUp = ({ confirmHandler, closeHandler }) => {
  return (
    <div className='w-screen h-screen fixed top-0 left-0 z-[9999] bg-black/60 flex justify-center items-center'>
        <div className="bg-white p-8 rounded-md">
            <h2 className="text-lg font-bold mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to proceed?</p>
            <div className="flex justify-end">
                <button onClick={confirmHandler} className="bg-green-500 text-white !px-4 !py-2 !mr-2 rounded-md">Yes</button>
                <button onClick={closeHandler} className="bg-gray-300 text-gray-600 !px-4 !py-2 rounded-md">No</button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationPopUp