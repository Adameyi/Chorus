import React from 'react'

function PinnedMessageModal(setPinnedModalOpen, pinnedModalOpen) {

  function closeModal() {
    setPinnedModalOpen(false)
  }

  const pinnedMessages = []

  return (
        <div 
        onClick={closeModal}
        className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
            <div
              onClick={(e) => e.stopPropagation()}
              className='bg-white w-1/3 flex flex-col space-y-5 p-6'>
              <div className='flex justify-between m-2'>
                <h1>Pinned Messages</h1>
                                    {/* Chat Box */}
                    <div className=''>
                        {pinnedMessages.map((message) => {
                            // const isCurrentUser = message.sender.id === currentUser.id;
                            return (
                                <div
                                    onMouseEnter={(e) => setIsHoveredId(message.id)}
                                    onMouseLeave={(e) => setIsHoveredId(null)}

                                    key={message.id}
                                    className='flex flex-row gap-2 text-sm mt-4'>
                                    <img
                                        src={UserSender}
                                        alt="Profile 1"
                                        className='w-16 h-16 rounded-lg'
                                    />
                                    <div className='relative flex flex-col gap-2'>
                                        {/* Message Options */}
                                        <div
                                            className={` ${!isCurrentUser ? 'bg-blue-400' : 'bg-slate-400'} py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl`}>
                                            {message.reply_to && (
                                                <small className='text-gray-700'><b>@{message.reply_to.sender}</b> <span className='italic truncate'>{message.reply_to.content}</span></small>
                                            )}
                                            <div className='flex flex-row justify-between items-center'>
                                                <h1 className='font-bold text-lg'>{message.sender.username}</h1>
                                                <span className='text-slate-500'>{formatTime(message.timestamp)}</span>
                                            </div>
                                            {/* Message Content */}
                                            {message.content &&
                                                <>
                                                    {selectedMessageForEdit === message.id ?
                                                        (<input
                                                            type="text"
                                                            value={editableMessageContent[message.id] || ""}
                                                            onChange={(e) => setEditableMessageContent({
                                                                ...editableMessageContent,
                                                                [message.id]: e.target.value,
                                                            })}
                                                            onBlur={() => setSelectedMessageForEdit(null)} //Clear on blur

                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleSaveEditedMessage(message.id)
                                                                } else if (e.key === 'Escape') {
                                                                    setSelectedMessageForEdit(null)
                                                                }
                                                            }}
                                                            autoFocus
                                                        />)
                                                        :
                                                        (
                                                            <p className='mb-2'>
                                                                {message.content}
                                                            </p>
                                                        )
                                                    }
                                                </>    
                                            }
                                            {/* Message Images */}
                                            {message.images && message.images.length > 0 && (
                                                <div className='flex flex-col gap-2 mt-2'>
                                                    {

                                                        message.images.map((image, index) => {
                                                            const imageUrl = getFullImageUrl(image.image_url || image.image)

                                                            //Image Debug Log
                                                            if (!imageUrl) {
                                                                console.warn('No valid image URL found for image: ', image)
                                                                return null
                                                            }

                                                            return (
                                                                <div key={index} className='flex flex-col'>
                                                                    <img
                                                                        src={imageUrl}
                                                                        alt={image.caption || `Image ${index + 1}`}
                                                                        className='max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity'
                                                                        onClick={() => window.open(imageUrl, '_blank')}
                                                                    />
                                                                    {image.caption && (
                                                                        <p className='text-sm text-gray-600 mt-1 italic'>
                                                                            {image.caption}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )
                                                        }
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
              </div>
            </div >
          </div>
  )
}

export default PinnedMessageModal