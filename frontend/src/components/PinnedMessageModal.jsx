import React from 'react'

function PinnedMessageModal(setPinnedModalOpen, pinnedModalOpen) {

  function closeModal() {
    setPinnedModalOpen(false)
  }

  return (
        <div 
        onClick={closeModal}
        className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
            <div
              onClick={(e) => e.stopPropagation()}
              className='bg-white w-1/3 flex flex-col space-y-5 p-6'>
              <div className='flex justify-between m-2'>
                <h1>Pinned Messages</h1>
              </div>
            </div >
          </div>
  )
}

export default PinnedMessageModal