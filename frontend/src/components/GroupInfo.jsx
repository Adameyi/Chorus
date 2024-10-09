import React, { useState } from 'react';
import groupChatImage from '../assets/images/groupChatImage.png'
import userPlaceholder from '../assets/images/userPlaceholder.png'
import Accordion from '../components/Accordion';

const groupChatFiles = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
    { title: 'Section 4', content: 'Content for section 4' },
]

function GroupInfo() {
    const [activeIndex, setActiveIndex] = useState(null)

    const handleShow = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }
    return (
        <div className='m-4 rounded-3xl bg-white p-4'>
            <div className='flex flex-row justify-between'>
                <h1 className='text-2xl font-bold'>
                    Group Info
                </h1>
                <div className='flex flex-row'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>
            </div>
            <div>
                <div className='flex flex-row gap-2 font-bold mt-4 '>
                    <h1>WW - Risk Management Team</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>

                </div>
                <div className="relative flex flex-row mt-3">
                    {/* Group Chat Image */}
                    <img src={groupChatImage} alt="groupChat" className="h-28 w-28 rounded-full" />
                    <div className='absolute bottom-0 left- z-10 h-8 w-8 rounded-full bg-gray-200 flex justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </div>
                    {/* Vertical Divider */}
                    <div className="h-20 w-px bg-gray-300 mx-4" />
                    <div>
                        <div className='grid grid-cols-3 gap-1'>
                            <img src={userPlaceholder} alt="userProfile" className="h-12 w-12 rounded-full" />
                            <img src={userPlaceholder} alt="userProfile" className="h-12 w-12 rounded-full" />
                            <img src={userPlaceholder} alt="userProfile" className="h-12 w-12 rounded-full" />
                            <img src={userPlaceholder} alt="userProfile" className="h-12 w-12 rounded-full" />
                            <img src={userPlaceholder} alt="userProfile" className="h-12 w-12 rounded-full" />
                            <img src={userPlaceholder} alt="userProfile" className="h-12 w-12 rounded-full" />
                        </div>
                        <p>8 Members <u>View More</u></p>
                    </div>
                </div>

                {/* Group Chat Files Accordion  */}
                <div className='bg-gray-300 p-2'>
                    {groupChatFiles.map((groupChatFiles, index) => (
                        <Accordion
                        key={index}
                        title={groupChatFiles.title}
                        isActive={activeIndex === index}
                        onShow={() => handleShow(index)}
                        >
                            <p className='p-4'>{groupChatFiles.content}</p>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GroupInfo