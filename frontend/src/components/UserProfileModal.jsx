import React, { useEffect, useState } from 'react'
import Banner from '../assets/images/banner.png'
import UserSender from '../assets/images/profile1.png'
import groupChatImage from '../assets/images/groupChatImage.png'
import { X, PhoneCall, Phone, MessageCircle, Camera, UserPlus, Ellipsis, MapPin, Globe, Mail, Building2, Clock2, User } from 'lucide-react';


function UserProfileModal({
    profileModalOpen,
    setProfileModalOpen,
}) {
    const [openProfileOption, setOpenProfileOption] = useState(false)
    const [active, setActive] = useState(0)

    const options = [
        { value: "GroupChatInvite", label: "Invite to Group Chat", warning: false },
        { value: "IgnoreUser", label: "Ignore User",  warning: true },
        { value: "RemoveFriend", label: "Remove Friend",  warning: true },
        { value: "BlockUser", label: "Block User",  warning: true },
        { value: "ReportUser", label: "Report User",  warning: true },
    ]

    function closeModal() {
        setProfileModalOpen(false)
    }
    return (
        <>
            {profileModalOpen &&
                <div
                    onClick={closeModal}
                    className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20' >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className='bg-white w-1/2 space-y-5 rounded-3xl h-[90%]'>
                        {/* Profile Banner */}
                        <div className='flex relative items-start'>
                            <img
                                src={Banner}
                                alt="profile_banner"
                                className='absolute bg-gray-200 w-full h-48  rounded-lg'
                            />
                            <div className='m-4 relative z-10 ml-auto'>
                                <button
                                    className='p-2 rounded-full bg-[#5C9170] mr-2'>
                                    <Ellipsis />
                                </button>
                                <button onClick={() => closeModal()} className='p-2 rounded-full bg-white'><X /></button>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 m-6'>

                            {/* Left Col */}
                            <div className='z-10 bg-[#AAB5AB] p-4 rounded-3xl rounded-bl-none rounded-br-none h-[119%]'>
                                <div className='flex flex-row'>
                                    <img src={UserSender} alt="" className='w-28 h-28 rounded-2xl' />
                                    <div className='rounded-full h-5 w-5 bg-red-600 mt-auto -ml-4' />
                                </div>
                                <h1 className='text-3xl font-bold' >Damien Jones</h1>
                                <h2 className='font-bold text-red-900'>In Meeting (12:14)</h2>
                                <p className='text-gray-800 text-sm m-2'>Team Manager at Covert Studios</p>
                                <div className='flex flex-row gap-2'>
                                    <button className='px-3 py-2 bg-[#5C9170] rounded-full flex flex-row gap-2 text-md items-center'><MessageCircle size={16} />Message</button>
                                    <button className='px-3 bg-[#5C9170] rounded-full'><PhoneCall size={16} /></button>
                                    <button className='px-3 bg-[#5C9170] rounded-full'><Camera size={16} /></button>
                                    <button className='px-3 bg-[#5C9170] rounded-full'><UserPlus size={16} /></button>
                                    <div>
                                        <button
                                            onClick={() => setOpenProfileOption(!openProfileOption)}
                                            className='p-3 bg-[#5C9170] rounded-full'><Ellipsis size={16} />
                                        </button>
                                        {openProfileOption &&
                                            <div className='absolute bg-[#5C9170] mt-2'>
                                                {options.map((option) =>
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleSelect(option)}
                                                        className={` ${option.warning && 'text-red-800 '} py-2 px-4 flex flex-col text-sm`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                )}
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className='leading-loose text-sm'>
                                    <hr className='mt-4 mb-4 border-gray-600' />
                                    <h2 className='text-lg font-medium mb-3'>Contact</h2>
                                    <p className='flex flex-row items-center gap-2'><Phone size={20} />Phone: (+02) 023 456 789 </p>
                                    <p className='flex flex-row items-center gap-2'><Mail size={20} />Email: amina.kone@coverts.com</p>
                                    <hr className='mt-4 mb-4 border-gray-600' />
                                    <h2 className='text-lg font-medium mb-3'>Company</h2>
                                    <p className='flex flex-row items-center gap-2'><Building2 size={20} /> Company Name: (+02) 023 456 789 </p>
                                    <p className='flex flex-row items-center gap-2'><Globe size={20} /> Website: amina.kone@coverts.com</p>
                                    <p className='flex flex-row items-center gap-2'><MapPin size={20} />Location: San Francisco</p>
                                </div>
                            </div>
                            {/* Right Col */}
                            <div>
                                <div className='z-20 grid grid-flow-col items-start mt-28 gap-y-1'>
                                    <button
                                        className={` ${active === 0 ? 'border-b-2 border-green-800 text-green-800 font-bold' : ''} border-gray-500`}
                                        onClick={() => setActive(0)}>
                                        Activities
                                    </button>
                                    <button
                                        className={` ${active === 1 ? 'border-b-2 border-green-800 text-green-800 font-bold' : ''} border-gray-500`}
                                        onClick={() => setActive(1)}
                                    >Friends
                                    </button>
                                    <button
                                        className={` ${active === 2 ? 'border-b-2 border-green-800 text-green-800 font-bold' : ''} border-gray-500`}
                                        onClick={() => setActive(2)}>
                                        Group Chats
                                    </button>

                                </div>
                                {/* Activities Section */}
                                {active === 0 &&
                                    <div>
                                        <div className='bg-[#AAB5AB] m-2 p-2 rounded-lg'>
                                            <div className='grid grid-cols-4 gap-2'>
                                                <img src={groupChatImage} alt='activities main' className='bg-gray-200 rounded-lg h-20 w-24' />
                                                <div className='col-span-3 flex flex-col justify-between '>
                                                    <div>
                                                        <h1 className='font-bold text-sm flex items-center'>Risk Management Team - Meeting <Ellipsis className='ml-auto' /></h1>
                                                        <p className='text-gray-600 text-sm'>Week 4 - Draft Project Report</p>
                                                    </div>
                                                    <div className='flex flex-row justify-between text-gray-600'>
                                                        <small className='flex items-center gap-2'><Clock2 size={14} />0:12:14</small>
                                                        <div className='flex flex-row -space-x-2'>
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <div className='h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-sm'>+6</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='bg-gray-200 m-2 p-2 rounded-lg'>
                                            <div className='grid grid-cols-4 gap-2'>
                                                <img src={groupChatImage} alt='activities main' className='bg-gray-200 rounded-lg h-20 w-24' />
                                                <div className='col-span-3 flex flex-col justify-between '>
                                                    <div>
                                                        <h1 className='font-bold text-sm flex items-center'>Risk Management Team - Meeting <Ellipsis className='ml-auto' /></h1>
                                                        <p className='text-gray-600 text-sm'>Week 3 - Draft Project Report</p>
                                                    </div>
                                                    <div className='flex flex-row justify-between text-gray-600'>
                                                        <small className='flex items-center gap-2'><Clock2 size={14} />1w ago (0:12:12)</small>
                                                        <div className='flex flex-row -space-x-2'>
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <img src={UserSender} alt="" className='w-6 h-6 rounded-2xl' />
                                                            <div className='h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-sm'>+6</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {/* ----- */}

                                {/* Friends Section */}
                                {active === 1 &&
                                    <div className='p-4 space-y-2'>
                                        <div className='flex flex-row gap-2 w-full'>
                                            <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                                                <User className='w-6 h-6 text-gray-600' />
                                            </div>
                                            <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full `} />
                                            <div className='w-full'>
                                                <h1>Adam Test</h1>
                                                <small>Some Bio</small>
                                            </div>
                                        </div>
                                        <div className='flex flex-row gap-2 w-full'>
                                            <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                                                <User className='w-6 h-6 text-gray-600' />
                                            </div>
                                            <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full `} />
                                            <div className='w-full'>
                                                <h1>Adam Test</h1>
                                                <small>Some Bio</small>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {/* --- */}

                                {/* Group Chat Section */}
                                {active === 2 &&
                                    <div className='p-4 space-y-2'>
                                        <div className='flex flex-row gap-2 w-full'>
                                            <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                                                <User className='w-6 h-6 text-gray-600' />
                                            </div>
                                            <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full `} />
                                            <div className='w-full'>
                                                <h1>Adam Test Group 1</h1>
                                                <small>Some Bio</small>
                                            </div>
                                        </div>
                                        <div className='flex flex-row gap-2 w-full'>
                                            <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                                                <User className='w-6 h-6 text-gray-600' />
                                            </div>
                                            <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full `} />
                                            <div className='w-full'>
                                                <h1>Adam Test Group 2</h1>
                                                <small>Some Bio</small>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {/* --- */}

                            </div>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}

export default UserProfileModal