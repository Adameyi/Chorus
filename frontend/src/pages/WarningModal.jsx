import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react';

function WarningModal({
    chatRoomId,
    warningModalOpen,
    setWarningModalOpen,
    currentUser,
    message,
    messageId,
    handleDeleteMessage,
    formatTime,
    mode,
}) {
    //Do not render warning msg if closed
    if (!warningModalOpen || !message) return null

    function closeModal() {
        setWarningModalOpen(false)
    }
    return (
        <div
            onClick={closeModal}
            className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-1/3 space-y-5 p-6'>
                <div className='flex justify-between'>
                    <h1 className='sm:text-2xl'>{mode === 'delete' ? 'Delete Message' : 'Unpin Message' }</h1>
                    <button
                        onClick={() => closeModal()}
                    ><X /></button>
                </div>
                <p> Are you sure you want to delete this message?</p>
                <div
                    className={` ${!currentUser ? 'bg-blue-400' : 'bg-slate-400'} flex flex-col py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl`}>
                    {message.reply_to && (
                        <small className='text-gray-700'><b>@{message.reply_to.sender}</b> <span className='italic truncate'>{message.reply_to.content}</span></small>
                    )}
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='font-bold text-lg'>{message.sender?.username}</h1>
                        <span className='text-slate-500'>{formatTime(message.timestamp)}</span>
                    </div>
                    <p className='mb-2'>
                        {message.content}
                    </p>
                </div>
                <div className='text-white flex gap-2'>
                    <button
                        onClick={() => closeModal()}
                        className='bg-gray-800 px-2 py-3 rounded-lg w-1/2 hover:bg-gray-500'
                    >Cancel</button>
                    <button
                        onClick={() => {handleDeleteMessage(message.id), closeModal()}}
                        className='bg-red-800 px-2 py-3 rounded-lg w-1/2 hover:bg-red-500'>Delete</button>
                </div>
            </div>
        </div>
    )
}

export default WarningModal