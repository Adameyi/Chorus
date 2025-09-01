import React, { useEffect, useState } from 'react'
import { chatAPI } from '../services/api'
import UserSender from '../assets/images/profile1.png'
import { X } from 'lucide-react';

function PinnedMessageModal({
    chatRoomId,
    pinnedModalOpen,
    setPinnedModalOpen,
    warningModalOpen,
    setWarningModalOpen,
    setMessageTarget,
    currentUser,
    message,
    messageId,
    formatTime,
    speakMessage,
    onJumpToMessage,
    setWarningMode,
}) {
    const [pinnedMessages, setPinnedMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!pinnedModalOpen) return
        let cancelled = false;
        setLoading(true)
        setError(null)

        chatAPI.getPinnedMessages(chatRoomId)
            .then((res) => {
                if (!cancelled) setPinnedMessages(res.data)
            })
            .catch((error) => {
                if (!cancelled) setError(error)
                console.error("Error fetching pinned messages:", error)
            })
            .finally(() => { if (!cancelled) setLoading(false) })

        return () => { cancelled = true }
    }, [pinnedModalOpen, chatRoomId])

    function closeModal() {
        setPinnedModalOpen(false)
    }

    function jumpToMessage(pinnedMessage) {
        return (
            <div className='flex justify-center items-center absolute right-3 bottom-1'>
                <button 
                onClick={() => onJumpToMessage(pinnedMssage.id)}
                className='bg-gray-500 py-1 px-2 rounded-lg border-2 border-gray-400'>
                    Jump
                </button>
                <button 
                onClick={() => {setMessageTarget(pinnedMessage), setWarningMode("unpin"), setWarningModalOpen(true), closeModal()}}
                className='bg-gray-500 p-1 rounded-lg border-2 border-gray-400'>
                    <X size={18}/>
                </button>
            </div>
        )
    }

    return (
        <>
            {pinnedModalOpen &&
                <div
                    onClick={closeModal}
                    className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className='bg-white w-1/3 space-y-5 p-6'>
                        <div className='flex flex-col justify-between m-2'>
                            <h1 className='sm:text-2xl'>Pinned Messages</h1>
                            {/* Chat Box */}
                            {loading && <p>Loading...</p>}
                            {error && <p className='text-red-500'> Failed to load pinned messages</p>}
                            <div className=''>
                                {!error && pinnedMessages.length === 0 ? (
                                    <p className='text-gray-500'>No pinned messages yet.</p>
                                ) : (
                                    pinnedMessages.map((pinnedMessage) => {
                                        const isCurrentUser = pinnedMessage.sender.id === currentUser.id;
                                        return (
                                            <div
                                                key={pinnedMessage.id}
                                                className='flex flex-row gap-2 text-sm mt-4'>
                                                <img
                                                    src={UserSender}
                                                    alt="Profile 1"
                                                    className='w-16 h-16 rounded-lg'
                                                />
                                                <div className='relative flex flex-col gap-2'>
                                                    {/* Message Options */}
                                                    <div
                                                        className={` ${!isCurrentUser ? 'bg-blue-400' : 'bg-slate-400'} flex flex-col py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl`}>
                                                        {pinnedMessage.reply_to && (
                                                            <small className='text-gray-700'><b>@{pinnedMessage.reply_to.sender}</b> <span className='italic truncate'>{pinnedMessage.reply_to.content}</span></small>
                                                        )}
                                                        <div className='flex flex-row justify-between items-center'>
                                                            <h1 className='font-bold text-lg'>{pinnedMessage.sender?.username}</h1>
                                                            <span className='text-slate-500'>{formatTime(pinnedMessage.timestamp)}</span>
                                                        </div>
                                                        {jumpToMessage(pinnedMessage)}
                                                        <p className='mb-2'>
                                                            {pinnedMessage.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }))}
                            </div>
                        </div>
                    </div >
                </div>
            }
        </>
    )
}

export default PinnedMessageModal