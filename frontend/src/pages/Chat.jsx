import '../styles/index.css';

import groupChatImage from '../assets/images/groupChatImage.png'
import userProfile2 from '../assets/images/profile2.png'
import Sidebar from '../components/Sidebar'
import MobileSidebar from "../components/MobileSideBar";
import MessageBar from '../components/MessageBar';
import ChatBox from '../components/ChatBox';
import UserProfile from '../components/UserProfile';
import GroupInfo from '../components/GroupInfo';

function Chat() {
    return (
        <div className="grid grid-cols-4">

            {/* Left-Side Panel */}
            <div className="bg-slate-200 h-screen sm:flex hidden flex flex-row">
                <Sidebar />
                <div>
                    {/* Chat Member List + Search */}
                    <div className='mt-4 flex flex-row flex-shrink max-w-72 justify-between items-center'>
                        <div className='flex flex-row gap-2 '>
                            <h1 className='font-bold text-3xl'>Chat</h1>
                        </div>
                        <div className='flex flex-row gap-2'>
                            <div className='p-2 rounded-lg bg-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                            </div>
                            <div className='p-2 rounded-lg bg-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                </svg>
                            </div>
                            <div className='p-2 rounded-lg bg-white'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                </svg>

                            </div>
                        </div>
                    </div>
                    <p className='mb-2'>________________________________________</p>
                    {/* Search Bar */}
                    <div className='flex flex-row items-center mb-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="m-2 text-white size-5 absolute">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input
                            type='text'
                            className='bg-[#93B2B6] placeholder-white rounded-lg p-1 pl-8 w-full '
                            placeholder='Search Users..'
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>
                    </div>
                    {/* End: Search Bar */}
                    <h2 className='font-bold text-gray-500 text-sm'>PINNED</h2>

                    {/* Text List Section */}
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    {/*  */}
                    <h2 className='font-bold text-gray-500 text-sm mt-2'>TEAMS</h2>
                    {/*  */}
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    {/*  */}
                    <h2 className='font-bold text-gray-500 text-sm mt-2'>RECENT</h2>
                    {/*  */}
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    <div className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'>
                        <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                        <div className='flex flex-col'>
                            <div className='flex flex-row justify-between items-center'>
                                <h1 className='font-bold'>Amina Kone</h1>
                                <p className='text-gray-500'>11:32AM (30m)</p>
                            </div>
                            <p>Hey Alex, do you need me to
                                complete the risk assessment..</p>
                        </div>
                    </div>
                    {/*  */}
                </div>
            </div>

            {/* Middle Panel */}
            <div className="sm:col-span-2 col-span-6 shadow-xl bg-gray-100 flex flex-col">
                <div className='flex flex-row'>
                    <MobileSidebar />
                    <div className="flex flex-row justify-between items-center shadow-xl h-24 w-full">
                        <div className="flex flex-row justify-between gap-3 py-4 px-2">
                            <img src={groupChatImage} alt="groupChat" className="h-16 w-16 rounded-full"></img>
                            <div>
                                <h1 className="font-bold sm:text-2xl">WW - Risk Management </h1>
                                <p className="flex flex-row text-slate-500">6 Members <span className="sm:flex hidden">(3 Online)</span> </p>
                            </div>
                        </div>

                        {/* Group Chat Buttons */}
                        <div className="flex flex-row gap-2 text-slate-600 py-4 px-2">
                            {/* Camera Button */}
                            <div className="flex justify-center items-center bg-slate-200 h-12 w-12 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
                                </svg>
                            </div>

                            {/* Call Button */}
                            <div className="flex justify-center items-center bg-slate-200 h-12 w-12 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {/* Info Button */}
                            <div className="flex justify-center items-center lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </div>
                            {/* Mobile Collapse */}
                            <div className="flex flex-row gap-2 hidden sm:flex">
                                <div className="flex justify-center items-center bg-slate-200 h-12 w-12 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                {/* Search Button */}
                                <div className="flex justify-center items-center bg-slate-200 h-12 w-12 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                    </svg>

                                </div>

                                {/*  */}
                                <div className="flex justify-center items-center bg-slate-200 h-12 w-12 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                        <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        {/* End: Group Chat Buttons */}

                    </div>
                </div>
                <ChatBox />
                <MessageBar />
            </div>
            {/* Right Panel */}
            <div className='sm:block hidden bg-slate-200'>
                <UserProfile />
                <GroupInfo/>
            </div>
        </div>
    );
}

export default Chat;