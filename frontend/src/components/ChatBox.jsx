import React from 'react'
import UserSender from '../assets/images/profile1.png'
import UserReceiver from '../assets/images/profile2.png'

function ChatBox() {
    return (
        <div className='p-2 sm:h-full h-[75vh] flex flex-col justify-end overflow-hidden'>
            <div className='overflow-y-auto h-full'>
            {/* End: Right-Side Chat (Receiver) */}
            {/* Left-Side Chat (Sender) */}
            <div className='flex flex-row gap-2 text-sm mt-4'>
                <img src={UserSender} alt="Profile 1" className='w-16 h-16 rounded-lg' />
                {/* Message Box */}
                <div className='flex flex-col gap-2'>
                    <div className='bg-slate-200 py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='font-bold text-lg'>David Writer</h1>
                            <span className='text-slate-500'>5:15pm (Edited)</span>
                        </div>
                        <p>Yes! Looking forward to it. It’ll be nice to relax and get to know
                            everyone better outside of work.</p>
                    </div>
                    <div className='bg-slate-200 py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='font-bold text-lg'>David Writer</h1>
                            <span className='text-slate-500'>5:15pm (Edited)</span>
                        </div>
                        <p>Yes! Looking forward to it. It’ll be nice to relax and get to know
                            everyone better outside of work.</p>
                    </div>
                    <div className='bg-slate-200 py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='font-bold text-lg'>David Writer</h1>
                            <span className='text-slate-500'>5:15pm (Edited)</span>
                        </div>
                        <p>Yes! Looking forward to it. It’ll be nice to relax and get to know
                            everyone better outside of work.</p>
                    </div>
                    <div className='bg-slate-200 py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='font-bold text-lg'>David Writer</h1>
                            <span className='text-slate-500'>5:15pm (Edited)</span>
                        </div>
                        <p>Yes! Looking forward to it. It’ll be nice to relax and get to know
                            everyone better outside of work.</p>
                    </div>
                </div>
            </div>
            {/* End: Left-Side Chat (Sender) */}

            {/* Right Left Chat (Receiver) */}
            <div className='flex flex-row justify-end gap-2 text-sm mt-4'>
                {/* Message Box */}
                <div className='flex flex-col gap-2'>
                    {/* Chat Bubble */}
                    <div className='bg-[#93B2B6] py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='font-bold text-lg'>Amina Kone</h1>
                            <span className='text-slate-500'>5:15pm (Edited)</span>
                        </div>
                        <p>Yes! Looking forward to it. It’ll be nice to relax and get to know
                            everyone better outside of work.</p>
                    </div>
                    {/* Emotes */}
                    <div className='mt-[-1rem] flex flex-row gap-2 pl-4'>
                        <button className='h-6 w-12 bg-white flex justify-center items-center shadow-xl rounded-full'>(a) 1</button>
                        <button className='h-6 w-12 bg-white flex justify-center items-center shadow-xl rounded-full'>(a) 1</button>
                        <button className='h-6 w-12 bg-white flex justify-center items-center shadow-xl rounded-full'>(a) 1</button>
                    </div>
                    {/* ------ */}
                </div>
                <img src={UserSender} alt="Profile 1" className='w-16 h-16 rounded-lg' />
            </div>
            {/* End: Right-Side Chat (Receiver) */}

            {/* Left-Side Chat (Sender) */}
            <div className='flex flex-row gap-2 text-sm mt-4'>
                <img src={UserSender} alt="Profile 1" className='w-16 h-16 rounded-lg' />
                {/* Message Box */}
                <div className='flex flex-col gap-2'>
                    <div className='bg-slate-200 py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='font-bold text-lg'>David Writer</h1>
                            <span className='text-slate-500'>5:15pm (Edited)</span>
                        </div>
                        <p>Yes! Looking forward to it. It’ll be nice to relax and get to know
                            everyone better outside of work.</p>
                    </div>
                    <div className='bg-slate-200 py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl'>
                        <div className='flex flex-row justify-between items-center'>
                            <h1 className='font-bold text-lg'>David Writer</h1>
                            <span className='text-slate-500'>5:15pm (Edited)</span>
                        </div>
                        <p>Yes! Looking forward to it. It’ll be nice to relax and get to know
                            everyone better outside of work.</p>
                    </div>
                </div>
            </div>
            {/* End: Left-Side Chat (Sender) */}
            </div>
        </div>
    )
}

export default ChatBox