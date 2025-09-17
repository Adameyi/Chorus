import React, { useEffect, useState } from 'react'
import Banner from '../assets/images/banner.png'
import UserSender from '../assets/images/profile1.png'
import { X } from 'lucide-react';


function UserProfileModal({
    profileModalOpen,
    setProfileModalOpen,
}) {

    function closeModal() {
        setProfileModalOpen(false)
    }
    return (
        <div
            onClick={closeModal}
            className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
            <div
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-1/2 space-y-5 rounded-lg'>
                    <img src={Banner} alt="profile_banner" className='absolute bg-gray-200 w-full h-20  rounded-lg'/>
                    <div className='grid grid-cols-2 m-6'>
                        {/* Left Col */}
                        <div className=' z-10 bg-[#a6c69d]  p-4 rounded-2xl'>
                            <img src={UserSender} alt="" className='w-52 h-52 rounded-2xl' />
                            <h1 >Alex Jones</h1>
                            <h2>In Meeting (12:14)</h2>
                            <p>Team Manager at Covert Studios</p>
                            <div className='flex flex-row'>
                                <button className='p-2 bg-green-700 rounded-2xl'>Message</button>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default UserProfileModal