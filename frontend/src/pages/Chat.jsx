import '../styles/index.css';
import React, { useState, useEffect, useRef } from 'react'
import groupChatImage from '../assets/images/groupChatImage.png'
import EditImageModal from '../components/EditImageModal'
import PinnedMessageModal from '../components/pinnedMessageModal'
import EmoteModal from '../components/EmoteModal'
import userProfile2 from '../assets/images/profile2.png'
import Sidebar from '../components/Sidebar'
import MobileSidebar from "../components/MobileSideBar"
import UserProfile from '../components/UserProfile'
import GroupInfo from '../components/GroupInfo'
import { Send, Users, Search, Ellipsis, Pencil, Trash2, X, SmilePlus, CornerUpLeft, CornerUpRight, Copy, Megaphone, Pin, PinOff, IdCard, Flag, MessageCircleReply, Cross } from 'lucide-react'
import { chatAPI, authAPI, getBaseURL } from '../services/api'
import UserSender from '../assets/images/profile1.png'
import SearchModal from '../components/SearchModal'
import WarningModal from '../components/WarningModal';

function Chat() {
    const [modalOpen, setModalOpen] = useState(false)
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [emoteModalOpen, setEmoteModalOpen] = useState(false)
    const [messageModalOpen, setMessageModalOpen] = useState(false)
    const [pinnedModalOpen, setPinnedModalOpen] = useState(false)
    const [warningModalOpen, setWarningModalOpen] = useState(false)
    const [warningMode, setWarningMode] = useState(null)

    const [fullSearch, setFullSearch] = useState(false)

    const [chatRooms, setChatRooms] = useState([])
    const [selectedChatRoom, setSelectedChatRoom] = useState(null)
    const [chatRoomId, setChatRoomId] = useState(null)

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')

    const [replying, setReplying] = useState(false)
    const [replyToMessageId, setReplyToMessageId] = useState(null)
    const [replyToUser, setReplyToUser] = useState('')

    const [selectedImages, setSelectedImages] = useState([])
    const [selectedImageForEdit, setSelectedImageForEdit] = useState(null)
    const [imageCaptions, setImageCaptions] = useState({})
    const [imagePreviewer, setImagePreviewer] = useState(false)
    const [selectedMessageForEdit, setSelectedMessageForEdit] = useState(null)
    const [editableMessageContent, setEditableMessageContent] = useState({})

    const [loading, setLoading] = useState(true)

    const [selectedUser, setSelectedUser] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    const [showProfile, setShowProfile] = useState(false)
    const [showGroupChat, setShowGroupChat] = useState(false)
    const [width, setWidth] = useState(window.innerWidth)

    //Edit Message States
    const [isHoveredId, setIsHoveredId] = useState(null)

    //User States
    const [currentUser, setCurrentUser] = useState(null)
    const [userLoading, setUserLoading] = useState(true)

     const [messageTarget, setMessageTarget] = useState(null)

    // Reference to scroll chat box
    const messagesEndRef = useRef(null);

    // Storage for multiple refs
    const messageRefs = useRef({})

    // Reference to close message options modal
    const messageModalRef = useRef(null);

    const [jumpToMessageId, setJumpToMessageId] = useState(null)
    const [highlightedMessageId, setHighlightedMessageId] = useState(null)

    //Function to scroll to messageId and highlight text
    const handleJumpToMessage = (messageId) => {
        setJumpToMessageId(messageId)
        setHighlightedMessageId(messageId)
        setPinnedModalOpen(false)

        setTimeout(() => {
            setHighlightedMessageId(null)
            setJumpToMessageId(null)
        }, 3000)
    }

    useEffect(() => {
        if (jumpToMessageId) {
            const messageElement = messageRefs.current[jumpToMessageId]
            if (messageElement) {
                messageElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })
            }
        }
    }, [jumpToMessageId])

    function speakMessage(text, name) {
        if (!window.speechSynthesis) {
            alert('This browser does not support text-to-speech features.')
            return
        }

        const utterance = new SpeechSynthesisUtterance(`${name} says ${text}`)
        utterance.lang = 'en-US'
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
    }

    const renderMessageContent = (content) => {
        const linkPattern= /\[([^\]]+)\]/g;

        //Return as-is if no bracket text is found.
        if (!linkPattern.test(content)) {
            return content
        }

        const parts = content.split(linkPattern)
        const elements = []

        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                if (parts[i]) {
                    elements.push(parts[i])
                }
            } else {
                //BracketedText (Make it clickable)
                const linkedText = parts[i]
                if (linkedText.toLowerCase().includes('pinned messages')) {
                    elements.push(
                        <button
                            key={i}
                            onClick={() => setPinnedModalOpen(true)}
                            className='text-blue-600 underline hover:text-blue-900'
                        >
                            {linkedText}
                        </button>
                    )
                } else {
                    elements.push(`[${linkedText}]`)
                }
            }
        }
        return elements
    }

    function handleWindowSizeChange() {
        setWidth(window.innerWidth)
    }

    const handleInputChange = (e) => {
        setNewMessage(e.target.value)
    }

    //Close modal if selected outside.
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 2 Conditions:
            // (messageModalRef) = a React useRef obj pointing to modal element in DOM
            // if the clicked event is not a child of the modal
            if (messageModalRef.current && !messageModalRef.current.contains(event.target)) {
                setMessageModalOpen(false)
            }
        }

        if (messageModalOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [messageModalOpen])

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
    }, [])

    const isMobile = width <= 768

    //Load Chat rooms with current user
    useEffect(() => {
        loadChatRooms()
    }, [currentUser])

    //Load messages for selectedChatRoom
    useEffect(() => {
        if (selectedChatRoom) {
            loadMessages(selectedChatRoom.id)
        }
    }, [selectedChatRoom])

    // Fixed: Added scroll effect when messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        const getCurrentUser = async () => {
            setUserLoading(true)
            try {
                const response = await authAPI.getCurrentUser()
                console.log('Fetched current user:', response.data)
                //Store only use data
                setCurrentUser(response.data)
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
    const loadMessages = async (id) => {
        try {
            const response = await chatAPI.getMessages(id)
            setMessages(response.data)
            setChatRoomId(id)
        } catch (error) {
            console.error("Error loading messages", error)
        }
    }

    // Handler for file input change.
    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files)
        setSelectedImages(prevImages => [...prevImages, ...files])

        //Initialize captions for new images
        const newCaptions = { ...imageCaptions }
        files.forEach(file => {
            if (!newCaptions[file.name]) {
                newCaptions[file.name] = ''
            }
        })
        setImageCaptions(newCaptions)
    }

    const handleImageUpdate = (updateData) => {
        const { originalName, newName, caption } = updateData

        // Handler for specified image caption change
        setImageCaptions(prev => ({
            ...prev,
            [originalName]: caption
        }))

        //Update file name (New File Object)
        if (newName !== originalName) {
            setSelectedImages(prev =>
                prev.map(img => {
                    if (img.name === originalName) {
                        //Create a new File obj with new name
                        const newFile = new File([img], newName, { type: img.type })
                        return newFile
                    }
                    return img
                })
            )

            //Update caption key to new name
            setImageCaptions(prev => {
                const newCaptions = { ...prev }
                if (newCaptions[originalName]) {
                    newCaptions[newName] = newCaptions[originalName]
                    delete newCaptions[originalName]
                }
                return newCaptions
            })
        }

        const saveImageDataToAPI = async (originalName, newName, caption) => {
            try {
                const response = await fetch('api/update-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        originalName,
                        newName,
                        caption
                    })
                })

                if (!response.ok) {
                    throw new Error('Failed to update image data')
                }

                console.log('Image Update Success')

            } catch (imgError) {
                console.log('Error updating image data to API', imgError)
            }
        }
    }

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return null

        // If already with a full URL, return as is
        if (imageUrl.startsWith('http://localhost:8000/')) {
            return imageUrl
        }

        const fullImageUrl = `${getBaseURL()}${imageUrl}`
        return fullImageUrl
    }

    //Remove selected image
    const removeSelectedImage = (imageToRemove) => {
        setSelectedImages(prev => prev.filter(img => img !== imageToRemove))
        setImageCaptions(prev => {
            const updated = { ...prev }
            delete updated[imageToRemove.name]
            return updated
        })
    }

    // Centralized function to send msg.
    const sendMessage = async (e) => {
        e.preventDefault()

        //Ensure at least a single input: Either text or image is provided.
        if ((!newMessage.trim() && selectedImages.length === 0) || !selectedChatRoom) return

        //Debug to test image output
        console.log('Sending message with:', {
            text: newMessage,
            images: selectedImages.length,
            captions: imageCaptions,
        })

        try {
            // Create FormData for multipart form data.
            const formData = new FormData()

            // Add text content.
            formData.append('content', newMessage)

            // Add images.
            selectedImages.forEach((image) => {
                formData.append('images', image)
            })

            // Add captions with correct key format.
            Object.entries(imageCaptions).forEach(([imageName, caption]) => {
                formData.append(`caption_${imageName}`, caption)
            })

            if (replying && replyToMessageId) {
                formData.append('reply_to', replyToMessageId)
            }

            const response = await chatAPI.sendMessage(selectedChatRoom.id, formData)
            console.log("Message successfully sent! ", response)

            // Reload/Render messages after sending to see the new message.
            await loadMessages(selectedChatRoom.id)

            //Clear input fields after post is sucesssful.
            setNewMessage('') // Reset text input.
            setSelectedImages([]) // Clear selected images.
            setImageCaptions({}) // Clear image captions.
            setImagePreviewer(false)
            setReplying(false)
            setReplyToContent('')
            setReplyToUser('')
            setReplyToMessageId(null)

        } catch (error) {
            console.error('Error sending messages or media:', error)
            console.error('Error details:', error.response?.data)
        }
    }

    const handleSaveEditedMessage = async (messageId) => {
        const newContent = editableMessageContent[messageId]

        //Prevent saving if input is empty or no room is selected.
        if (!newContent.trim() || !selectedChatRoom) return

        try {
            //Call API to update msg content.
            await chatAPI.editMessage(selectedChatRoom.id, messageId, newContent)
            await loadMessages(selectedChatRoom.id)

        } catch (msgEditError) {
            console.error("Failed to edit message:", msgEditError)
        }
    }

    const handleWarning = async (messageId) => {

    }

    const handleDeleteMessage = async (messageId) => {
        if (!selectedChatRoom) return

        try {
            await chatAPI.removeMessage(selectedChatRoom.id, messageId)
            await loadMessages(selectedChatRoom.id)

        } catch (msgDeleteError) {
            console.error("Failed to delete message", msgDeleteError)
        }
    }

    const handleReplyMessage = (message) => {
        setReplying(true)
        setReplyToMessageId(message.id)
        setReplyToContent(message.content)
        setReplyToUser(message.sender.username)
        setMessageModalOpen(false)
    }

    const handlePinMessage = async (chatRoomId, messageId, currentUser) => {
        try {
            const currentMessages = messages.find(msg => msg.id === messageId)
            const wasPinned = currentMessages?.is_pinned || false 
            
            await chatAPI.pinMessage(chatRoomId, messageId)
            
            //Announcement for pinning message
            if (!wasPinned) {
                const systemMessageContent = `${currentUser.username} pinned a message to this channel. View all`   
                const formData = new FormData()
                formData.append('content', systemMessageContent)
                await chatAPI.sendMessage(chatRoomId, formData)
                }
            // Refresh pinned messages or chatroom messages
            await loadMessages(chatRoomId)
            // await loadPinnedMessages(chatRoomId)


        } catch (pinError) {
            console.error('Error pinning message:', pinError)
        }
    }

    const handleRemovePinMessage = async () => {
        console.log()
    }

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const formatTime = (timestamp, mode = 'time') => {
        const messageDate = new Date(timestamp)
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1) // Offset by -1 Day from Today

        const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate())

        //Format (Today): 4:28AM
        const isToday = messageDateOnly.getTime() === today.getTime()

        //Format (Today): Yesterday At 4:28AM
        const isYesterday = messageDateOnly.getTime() === yesterday.getTime()

        if (mode === 'time') {
            const timeString = messageDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })

            if (isToday) return timeString
            if (isYesterday) return `Yesterday at ${timeString}`

            //Format (+2 Days): 20/08/2025 4:28AM
            const dateString = messageDate.toLocaleDateString('en-AU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
            return `${dateString} ${timeString}`
        }

        if (mode === 'divider') {
            if (isToday) return 'Today'
            if (isYesterday) return 'Yesterday'

            //Format (+2 Days): 20/08/2025 4:28AM
            return messageDate.toLocaleDateString('en-AU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        }
    }

    const displayDateDividerCheck = (currentMessage, previousMessage) => {
        if (!previousMessage) return true //Always display divider for initial message

        // Extract just the date (YYYY-MM-DD) as strings for comparison
        const currentDate = new Date(currentMessage.timestamp).toDateString()
        const previousDate = new Date(previousMessage.timestamp).toDateString()

        return currentDate !== previousDate
    }

    const DateDivider = ({ date }) => (
        <div className='flex items-center my-6'>
            <div className='flex-grow border-t border-gray-300' />
            <span className='mx-4 text-gray-500'>{date}</span>
            <div className='flex-grow border-t border-gray-300' />
        </div>
    )

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
            <div className='flex items-center justify-center h-screen bg-gray-100'>
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

    function openImageModal(image) {
        setSelectedImageForEdit(image)
        setImageModalOpen(true)
    }

    return (
        <>
            <div className="grid grid-cols-4 ">

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
                                <button className='p-2 rounded-lg bg-white' onClick={() => openModal()}>
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
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
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
                                        {/* Pinned Button */}
                                        <button
                                            onClick={() => setPinnedModalOpen(true)}
                                            className="flex justify-center items-center bg-slate-200 h-12 w-12 rounded-full">
                                            <Pin />
                                        </button>
                                        {/* Mobile Collapse */}
                                        <div className="flex flex-row gap-2 hidden sm:flex">
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
                    <div className={`p-2 ${imagePreviewer ? "sm:h-[61dvh] h-[75dvh]" : "sm:h-[82dvh] h-[82dvh]"} overflow-y-scroll`}>
                        {messages.map((message, index) => {
                            const isCurrentUser = message.sender.id === currentUser.id
                            const isHighlighted = highlightedMessageId === message.id
                            const previousMessage = index > 0 ? messages[index - 1] : null
                            const displayDateDivider = displayDateDividerCheck(message, previousMessage)
                            return (
                                <React.Fragment key={message.id}>
                                    {displayDateDivider &&
                                        <DateDivider date={formatTime(message.timestamp, 'divider')} />
                                    }
                                    <div
                                        //For each message, store its DOM element
                                        ref={(el) => messageRefs.current[message.id] = el}
                                        onMouseEnter={(e) => setIsHoveredId(message.id)}
                                        onMouseLeave={(e) => setIsHoveredId(null)}

                                        // key={message.id}
                                        className='flex flex-row gap-2 text-sm mt-4'>
                                        <img
                                            src={UserSender}
                                            alt="Profile 1"
                                            className='w-16 h-16 rounded-lg'
                                            onClick={() => handleProfileClick({
                                                name: message.sender.username,
                                                role: 'Content Writer @ Covert Studios',
                                                phone: '(+02) 023 456 789',
                                                email: 'david.writer@coverts.com',
                                                image: UserSender
                                            })}
                                        />
                                        <div className='relative flex flex-col gap-2'>
                                            {/* Message Options */}
                                            {isHoveredId === message.id &&
                                                <div className='absolute gap-1 top-2 right-2 flex flex-row bg-blue-600 rounded-lg p-1 text-gray-200'>
                                                    {messageModalOpen &&
                                                        <div
                                                            ref={messageModalRef}
                                                            className='w-[140%] z-40 p-2 absolute bg-blue-500 rounded-lg shadow-xl flex flex-col gap-4'>
                                                            <button className='flex flex-row justify-between'>Add Reaction <SmilePlus size={20} /></button>
                                                            <hr />
                                                            <button className='flex flex-row justify-between'>Edit Message <Pencil size={20} /></button>
                                                            <button className='flex flex-row justify-between'>Copy Message <Copy size={20} /></button>
                                                            {isCurrentUser &&
                                                                <button
                                                                    onClick={() => {setMessageTarget(message), setWarningMode("delete"), setWarningModalOpen(true)}}
                                                                    className='flex flex-row justify-between'>Delete Message <Trash2 size={20} /></button>
                                                            }

                                                            {!isCurrentUser &&
                                                                <button
                                                                    onClick={() => handleReplyMessage(message)}
                                                                    className='flex flex-row justify-between'>Reply  <MessageCircleReply size={20} />
                                                                </button>
                                                            }
                                                            <button className='flex flex-row justify-between'>Forward <CornerUpRight size={20} /></button>
                                                            <hr />
                                                            {message.is_pinned ? (
                                                                <button
                                                                    onClick={() => handlePinMessage(chatRoomId, message.id, currentUser)}
                                                                    className='flex flex-row justify-between'>Unpin Message  <PinOff size={20} />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handlePinMessage(chatRoomId, message.id, currentUser)}
                                                                    className='flex flex-row justify-between'>Pin Message  <Pin size={20} />
                                                                </button>
                                                            )
                                                            }
                                                            <button
                                                                onClick={() => speakMessage(message.content, message.sender.username)}
                                                                className='flex flex-row justify-between'>Speak Message <Megaphone size={20} />
                                                            </button>
                                                            <button className='flex flex-row justify-between'>Copy ID    <IdCard size={20} /></button>
                                                            <button className='text-red-400 flex flex-row justify-between'>Report Message  <Flag size={20} /> </button>

                                                        </div>
                                                    }
                                                    <SmilePlus size={20} />
                                                    <Pencil size={20} onClick={() => {
                                                        setSelectedMessageForEdit(message.id)
                                                        setEditableMessageContent({ ...editableMessageContent, [message.id]: message.content })
                                                    }} />
                                                    <button onClick={() => handleReplyMessage(message)}>
                                                        <CornerUpLeft size={20} />
                                                    </button>
                                                    <CornerUpRight size={20} />
                                                    {message.sender.id === currentUser.id &&
                                                        <button
                                                            onClick={() => {setMessageTarget(message), setWarningMode("delete"), setWarningModalOpen(true)}}
                                                            className='text-red-500'
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    }
                                                    <button onClick={() => setMessageModalOpen(true)}>
                                                        <Ellipsis size={20} />
                                                    </button>
                                                </div>
                                            }
                                            <div
                                                className={` ${!isCurrentUser ? 'bg-blue-400' : 'bg-slate-400'} py-2 px-4 sm:w-96 rounded-tr-2xl rounded-bl-2xl`}>
                                                {message.reply_to && (
                                                    <small className='text-gray-700'><b>@{message.reply_to.sender}</b> <span className='italic truncate'>{message.reply_to.content}</span></small>
                                                )}
                                                <div className='flex flex-row justify-between items-center'>
                                                    <h1 className='font-bold text-lg'>{message.sender.username}</h1>
                                                    <span className='text-slate-500'>{formatTime(message.timestamp, 'time')}</span>
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
                                                                <p className={`mb-2 ${isHighlighted ? 'bg-yellow-300' : ''}`}>
                                                                    {renderMessageContent(message.content)}
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
                                </React.Fragment>
                            )
                        })}
                        <div ref={messagesEndRef}></div>
                    </div>


                    {/* Image Previewer */}
                    {imagePreviewer &&
                        <div className='absolute bottom-[0vh] bg-[#93B2B6] p-4 pb-12 h-[38vh] w-[92vh] overflow-y-auto'>
                            <div className='flex flex-row justify-between'>
                                <h3 className='text-white font-semibold mb-2'>Selected Images ({selectedImages.length})</h3>
                                <div className='flex items-center'>
                                    <button
                                        onClick={() => setImagePreviewer(false)}
                                        className='text-white hover:text-red-300'
                                    >
                                        <X />
                                    </button>
                                </div>
                            </div>
                            <div className='flex flex-row gap-2'>
                                {selectedImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className='flex flex-col bg-white/20 p-1 rounded-lg '
                                    >
                                        <div className='flex justify-end'>
                                            <div className='w-1/2 flex justify-center items-center gap-2 p-1'>
                                                <button
                                                    onClick={() => openImageModal(image)}
                                                    className='text-teal-500 hover:text-teal-500'
                                                >
                                                    <Pencil />
                                                </button>
                                                <button
                                                    onClick={() => removeSelectedImage(image)}
                                                    className='text-red-500 hover:text-red-500'
                                                >
                                                    <Trash2 />
                                                </button>
                                            </div>
                                        </div>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Preview ${index}`}
                                            className='w-32 h-32 object-cover-rounded rounded-lg'
                                        />
                                        <div className='flex-1'>
                                            <small className='text-white text-xs truncate'>
                                                {image.name}
                                            </small>
                                            {/* <input
                                                type="text"
                                                placeholder='Add Caption...'
                                                value={imageCaptions[image.name] || ''}
                                                onChange={(e) => handleCaptionchange(image.name, e.target.value)}
                                                className='w-full mt-1 px-2 py-1 text-xs rounded bg-white/30 text-white placeholder-white/70'
                                            /> */}
                                        </div>
                                    </div>
                                ))}

                                {selectedImages.length === 0 && (
                                    <p className='text-white/70 text-center py-4'>
                                        Click here or Drag & Drop images
                                    </p>
                                )}
                            </div>
                        </div>
                    }
                    <EmoteModal
                        emoteModalOpen={emoteModalOpen}
                        setEmoteModalOpen={setEmoteModalOpen}
                        setNewMessage={setNewMessage}
                    />

                    <div className='flex flex-col p-2 absolute bottom-0 w-full sm:w-[92vh]'>
                        {replying &&
                            <div className=' rounded-lg bg-teal-600 p-2 flex justify-between text-white'>
                                <span>Replying to <b>{replyToUser}</b></span>
                                <button
                                    onClick={() => {
                                        setReplying(false)
                                        setReplyToContent('')
                                        setReplyToMessageId(null)
                                        setReplyToUser('')
                                    }}
                                ><X size={20} /></button> </div>
                        }
                        <div className='flex flex-row'>
                            {/* Hidden file input */}
                            <input
                                type="file"
                                id="imageInput"
                                multiple
                                accept="image/*"
                                onChange={handleImageSelect}
                                className='hidden'
                            />

                            {/* Image attachment button */}
                            <label
                                onClick={() => setImagePreviewer(true)}
                                htmlFor="imageInput"
                                className='p-3 absolute text-teal-600 cursor-pointer hover:bg-teal-100 hover:text-teal-800 rounded-full transition-all duration-200'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </label>
                            <input
                                className='border-none outline-none text-inherit bg-[#93B2B6] roboto-light placeholder-teal-600 text-white p-4 pl-16 w-full rounded-md'
                                type='text'
                                value={newMessage}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
                                placeholder={isMobile ? `Type a message...` : `Message @${getChatRoomDisplayName(selectedChatRoom)}`}
                            />
                            <div className='ml-[-5.5rem] flex justify-center items-center gap-2 text-teal-600'>
                                {/* Microphone Button */}
                                <button>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                                    </svg>
                                </button>
                                {/* Emote Button */}
                                <button onClick={() => setEmoteModalOpen(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim() && selectedImages.length === 0}
                                className='flex justify-center items-center bg-teal-600 text-white w-12 rounded-md ml-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
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
            <SearchModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                fullSearch={fullSearch}
            />
            <EditImageModal
                imageModalOpen={imageModalOpen}
                setImageModalOpen={setImageModalOpen}
                imageName={selectedImageForEdit?.name || ''}
                imageCaption={imageCaptions[selectedImageForEdit?.name || '']}
                image={selectedImageForEdit ? URL.createObjectURL(selectedImageForEdit) : ''}
                onUpdate={handleImageUpdate}
            />

            <PinnedMessageModal
                chatRoomId={chatRoomId}
                pinnedModalOpen={pinnedModalOpen}
                setPinnedModalOpen={setPinnedModalOpen}
                warningModalOpen={warningModalOpen}
                setWarningModalOpen={setWarningModalOpen}
                setMessageTarget={setMessageTarget}
                currentUser={currentUser}
                message={messageTarget}
                messageId={messageTarget?.id}
                formatTime={formatTime}
                speakMessage={speakMessage}
                onJumpToMessage={handleJumpToMessage}
                setWarningMode={setWarningMode}
            />
            <WarningModal
                chatRoomId={chatRoomId}
                warningModalOpen={warningModalOpen}
                setWarningModalOpen={setWarningModalOpen}
                currentUser={currentUser}
                message={messageTarget}
                messageId={messageTarget?.id}
                handlePinMessage={handlePinMessage}
                handleDeleteMessage={handleDeleteMessage}
                formatTime={formatTime}
                mode={warningMode}
            />
        </>
    );
}

export default Chat;