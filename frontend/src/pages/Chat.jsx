import '../styles/index.css';
import React, { useState, useEffect, useRef } from 'react';
import groupChatImage from '../assets/images/groupChatImage.png'
import userProfile2 from '../assets/images/profile2.png'
import Sidebar from '../components/Sidebar'
import MobileSidebar from "../components/MobileSideBar";
import UserProfile from '../components/UserProfile';
import GroupInfo from '../components/GroupInfo';
import { Send, Users, Phone, Video, Search, Info, Plus, Smile } from 'lucide-react'
import { chatAPI, authAPI } from '../services/api'
import UserSender from '../assets/images/profile1.png'
import UserReceiver from '../assets/images/profile2.png'
import SearchModal from '../components/SearchModal';

function Chat() {
    const [modalOpen, setModalOpen] = useState(false)
    const [fullSearch, setFullSearch] = useState(false)

    const [chatRooms, setChatRooms] = useState([])
    const [selectedChatRoom, setSelectedChatRoom] = useState(null)

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    const [loading, setLoading] = useState(true)

    const [showUserProfile, setShowUserProfile] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    const [showProfile, setShowProfile] = useState(false)
    const [showGroupChat, setShowGroupChat] = useState(false)
    const [width, setWidth] = useState(window.innerWidth)

    //User States
    const [currentUser, setCurrentUser] = useState(null)
    const [userLoading, setUserLoading] = useState(true)

    const messagesEndRef = null;

    function handleWindowSizeChange() {
        setWidth(window.innerWidth)
    }

    const handleInputChange = (e) => {
        console.log('Typing Message', e.target.value)
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
    }, [])

    const isMobile = width <= 768

    useEffect(() => {
        loadChatRooms()
    }, [currentUser])

    useEffect(() => {
        if (selectedChatRoom) {
            loadMessages(selectedChatRoom.id)
        }
    }, [selectedChatRoom])

    useEffect(() => {
        const getCurrentUser = async () => {
            setUserLoading(true)
            try {
                const response = await authAPI.getCurrentUser()
                console.log('Fetched current user:', response.data)
                //Store only use data
                setCurrentUser(response)
                console.log('After setting currentUser:', response.data);
            } catch (authError) {
                console.error("Error fetching current user:", authError)
            } finally {
                setUserLoading(false)
            }
        }

        getCurrentUser()
    }, []) // Empty dependency array to run once on mount

    //Centralized function to load chat rooms.
    const loadChatRooms = async () => {
        setLoading(true)
        try {
            const response = await chatAPI.getChatRooms()
            setChatRooms(response.data)
            if (response.data.length > 0) {
                setSelectedChatRoom(response.data[0])
            }
        } catch (error) {
            console.error("Error loading chat rooms:", error)
        } finally {
            setLoading(false)
        }
    }

    // Centralized function to load msg for a specific chat room.
    const loadMessages = async (chatRoomId) => {
        try {
            const response = await chatAPI.getMessages(chatRoomId)
            setMessages(response.data)
        } catch (error) {
            console.error("Error loading messages", error)
        }
    }

    // Centralized function to send msg
    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedChatRoom) return

        const messageContent = newMessage.trim()
        setNewMessage('')

        try {
            const response = await chatAPI.sendMessage(selectedChatRoom.id, messageContent)
            const newMsg = response.data
            setMessages(prev => [...prev, newMsg])
        } catch (error) {
            console.error('Error sending messages:', error)
        }

    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getChatRoomDisplayName = (room) => {
        if (room.is_group_chat) {
            return room.name || 'Group Chat'
        } else {
            if (!currentUser) {
                return 'Direct Message'
            }
            const otherParticipant = room.participants.find(p => p.id !== currentUser.id)
            return otherParticipant ? otherParticipant.username : 'Direct Message'
        }
    }

    const filteredChatRooms = chatRooms.filter(room => {
        const displayName = getChatRoomDisplayName(room).toLowerCase()
        return displayName.includes(searchQuery.toLowerCase())
    })

    if (loading || userLoading) {
        return (
            <div className='flex items-center justify-cetner h-screen bg-gay-100'>
                <div className='text-xl'> Loading Chat... </div>
            </div>
        )
    }

    const handleProfileClick = (userData) => {
        setSelectedUser(userData)
        setShowProfile(true)
    }

    function openModal() {
        setModalOpen(true)
        setFullSearch(false)
    }

    function openSearchModal() {
        setFullSearch(true)
    }


    return (
        <>
            <div className="grid grid-cols-4">

                {/* Left-Side Panel */}
                <div className="bg-slate-200 h-screen sm:flex hidden flex flex-row">
                    <Sidebar />
                    <div className='overflow-y-auto overflow-x-hidden'>
                        {/* Chat Member List + Search */}
                        <div className='mt-4 flex flex-row flex-shrink max-w-72 justify-between items-center'>
                            <div className='flex flex-row gap-2 '>
                                <h1 className='font-bold text-3xl'>Chat</h1>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <button className='p-2 rounded-lg bg-white' onClick={() => { openModal(), openSearchModal() }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                    </svg>
                                </button>
                                <button className='p-2 rounded-lg bg-white' onClick={openModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className='bg-[#93B2B6] placeholder-white rounded-lg p-1 pl-8 w-full '
                                placeholder='Search Conversations...'
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>
                        </div>
                        {/* End: Search Bar */}
                        <h2 className='font-bold text-gray-500 text-sm'>MESSAGES</h2>

                        {/* Text List Section */}
                        {filteredChatRooms.map((room) => (
                            <div
                                key={room.id}
                                className='flex flex-row border-b border-slate-300 p-2 gap-2 text-sm'
                                onClick={() => setSelectedChatRoom(room)}
                            >
                                <img src={userProfile2} alt="Listed User Profile" className='rounded-lg w-14 h-14' />
                                <div className='flex flex-col w-full'>
                                    <div className='flex flex-row justify-between items-center'>
                                        <h2 className='font-bold text-xs'>{getChatRoomDisplayName(room)}</h2>
                                        <small className='text-gray-500'>{formatTime(room.last_message.timestamp) || ''}</small>
                                    </div>
                                    <p>{room.last_message ? room.last_message.content : 'No messages yet'}</p>
                                </div>
                            </div>
                        ))}
                        {/*  */}
                    </div>
                </div>

                {/* Middle Panel */}
                <div className="sm:col-span-2 col-span-6 shadow-xl bg-gray-100 flex flex-col">
                    <div className='flex flex-row'>
                        <MobileSidebar />
                        {selectedChatRoom ? (
                            <>
                                <div className="flex justify-between items-center shadow-xl h-24 w-full">
                                    <div className="flex flex-row justify-between gap-3 py-4 px-2">
                                        <img src={groupChatImage} onClick={() => setShowGroupChat(true)} alt="groupChat" className="h-16 w-16 rounded-full"></img>
                                        <div>
                                            <h1 className="font-bold sm:text-2xl">{getChatRoomDisplayName(selectedChatRoom)} </h1>
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
                            </>
                        ) : (
                            <div>Select a conversation to start messaging</div>
                        )}
                    </div>
                    {/* Chat Box */}
                    <div className='p-2 sm:h-full h-[75vh] flex flex-col justify-end overflow-hidden'>
                        <div className='overflow-y-auto h-full flex flex-col justify-end'>
                            {messages.map((message) => {
                                const isCurrentUser = message.sender.id === currentUser.id;
                                console.log('Message Sender ID:', message.sender.id, 'Current User ID:', currentUser.id)
                                return (
                                    <div key={message.id} className='flex flex-row gap-2 text-sm mt-4'>
                                        <img
                                            src={UserSender}
                                            alt="Profile 1"
                                            className='w-16 h-16 rounded-lg'
                                            onClick={() => onProfileClick({
                                                name:  message.sender.username,
                                                role: 'Content Writer @ Covert Studios',
                                                phone: '(+02) 023 456 789',
                                                email: 'david.writer@coverts.com',
                                                image: UserSender
                                            })}
                                        />
                                        <div className='flex flex-col gap-2'>
                                            <div className={` ${!isCurrentUser ? 'bg-blue-400' : 'bg-slate-200'} py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl`}>
                                                <div className='flex flex-row justify-between items-center'>
                                                    <h1 className='font-bold text-lg'>{!isCurrentUser && <div>{message.sender.username}</div>}</h1>
                                                    <span className='text-slate-500'>{formatTime(message.timestamp)}</span>
                                                </div>
                                                <p>{message.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef}></div>
                        </div>
                    </div>
                    <div className='flex flex-row p-2'>
                        <button className='p-4 absolute text-teal-600'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>

                        </button>
                        <input
                            className='border-none outline-none text-inherit bg-[#93B2B6] roboto-light placeholder-teal-600 text-white p-4 pl-12 w-full rounded-md'
                            type='text'
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
                            placeholder={isMobile ? `Type a message...` : `Message @${getChatRoomDisplayName(selectedChatRoom)}`}
                        />
                        <div className='ml-[-5.5rem] flex justify-center items-center gap-2 text-teal-600'>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                </svg>
                            </button>
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                </svg>
                            </button>
                        </div>
                        <button
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className='flex justify-center items-center bg-teal-600 text-white w-12 rounded-md ml-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </button>
                    </div>

                    {/* Right Panel */}
                    <div className='sm:block hidden bg-slate-200'>
                        <UserProfile
                            showProfile={showProfile}
                            setShowProfile={setShowProfile}
                            userData={selectedUser} />
                        <GroupInfo
                            showGroupChat={showGroupChat}
                            setShowGroupChat={setShowGroupChat}
                        />
                    </div>
                </div>
            </div>
            <SearchModal modalOpen={modalOpen} setModalOpen={setModalOpen} fullSearch={fullSearch} />
        </>
    );
}

export default Chat;