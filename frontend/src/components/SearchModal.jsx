import React, { useState, useMemo } from 'react'
import { Search, MessageCircle, Users, User, Clock } from 'lucide-react'
import { userAPI, friendRequestAPI, chatAPI } from '../services/api'

const getStatusColor = (status) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'away': return 'bg-yellow-500'
    case 'offline': return 'bg-gray-400'
    default: return 'bg-gray-400'
  }
}

function SearchModal({ setModalOpen, modalOpen, fullSearch }) {
  const [searchQuery, setSearchquery] = useState('')
  const [groupName, setGroupName] = useState('')
  const [participantInput, setParticipantInput] = useState('')
  const [participants, setParticipants] = useState([])
  const [description, setDescription] = useState('')

  // API Data States
  const [chatRooms, setChatRooms] = useState([])
  const [friends, setFriends] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  //Fetch Data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null) //Reset the error state.

        console.log('Fetching Data...')

        //Mock current userprofile
        const mockUser = {
          id: 1,
          username: 'current_user',
          display_name: 'Current User',
          email: 'user@example.com',
        }
        setCurrentuser(mockUser)

        //Fetch Chat Rooms
        console.log('Fetching Chat rooms...')
        try {
          const chatRoomsResponse = await chatAPI.getChatRooms()
          console.log('Chat Rooms Response:', chatRoomsResponse)
          setChatRooms(chatRoomsResponse.Response.data || [])
        } catch (chatRoomError) {
          console.error('Error fetching chat rooms:', chatRoomError)
          setChatRooms([]) //Set Chat Rooms as empty array when faile
        }
        //Mock FriendsList

        //Fetch all users using search
        console.log('Fetching all users...')
        try {
          const usersResponse = await userAPI.searchUsers()
          console.log('Search Response:', chatRoomsResponse)
          setAllUsers(chatRoomsResponse.Response.data || [])
        } catch (searcError) {
          console.error('Error fetching users:', searcError)
          setAllUsers([]) //Set Chat Rooms as empty array when faile
        }
        console.log('Data fetch complete.')
      } catch (error) {
        console.error('Error in fetchData:', error)
        console.error('Error: details:', {
          message: error.message,
          response: error.reesponse?.data,
          status: error.response?.status
        })
        setError(`Failed to load data: ${error.response?.data?.message || error.message}`)
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
  }

  if (modalOpen) {
    console.log('Modal opened, fetching data...')
    fetchData()
  } else {
    console.log('Modal closed, resetting the loading state')
    setLoading(false)
  }
  }, [modalOpen])

  //Search users when search query event changes
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim()) {
        try {
          console.log('Search users with query:', searchQuery)
          const response = await userAPI.searchUsers(searchQuery)
          console.log('Search users response:', response)
          setAllUsers(response.data || [])
        } catch (error) {
          console.log('Error searching users:', error)
        }
      }
    } 

    const debounceTimer = setTimeout(searchUsers, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  //Filter functions
  const filteredChatRooms = useMemo(() => {
    if (!searchQuery) return chatRooms

    //Filter for Group Chat vs DMs
    return mockChatRoom.filter(conv => {
      if (conv.is_group_chat && conv.name) {
        return conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      } else {
        //For non-group chats, search through the participant names. Make sure it does not include logged in user's (self) name
        const otherParticipants = conv.participants.filter(p => p.username !== "john_doe")

        return otherParticipants.some(p => p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    })
  }, [searchQuery])

  const filteredFriends = useMemo(() => {
    if (!searchQuery) return mockFriends

    return mockFriends.filter(friend =>
      friend.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const filterAllUsers = useMemo(() => {
    if (!searchQuery) return mockAllUsers

    return mockAllUsers.filter(user =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const getConversationDisplayName = (conversation) => {
    if (conversation.is_group_chat && conversation.name) {
      return conversation.name
    } else {
      //For DM chats only, find the other participant
      const otherParticipant = conversation.participants.find(p => p.username !== "john_doe")
      return otherParticipant ? otherParticipant.displayName : "Unknown"
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const hourDiff = (now - date) / (1000 * 60 * 60)

    if (hourDiff < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const addFriend = (friend) => {
    if (!participants.includes(friend.displayName)) {
      setParticipants([...participants, friend.displayName])
    }
  }

  const addParticipant = () => {
    if (participantInput.trim() && !participants.includes(participantInput.trim())) {
      setParticipants([...participants, participantInput.trim()])
      setParticipantInput('')
    }
  }

  const removeParticipant = (name) => {
    setParticipants(participants.filter(p => p !== name))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      groupName,
      participants,
      description
    })
    //Reset form
    setGroupName('');
    setParticipants([])
    setDescription('')
    setModalOpen(false)
  }

  function closeModal() {
    setModalOpen(false)
  }

  return (
    <>
      {modalOpen &&
        <div
          onClick={closeModal}
          className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
          {/*Search Conversations, Users, Friends Modal */}
          {fullSearch &&
            <div
              onClick={(e) => e.stopPropagation()}
              className='bg-white w-full lg:w-1/3 flex flex-col space-y-5 p-6'>
              <Search className='absolute mt-7 w-7 h-7 ml-2 text-gray-400' />
              <input
                type="text"
                placeholder='Where would you like to go?'
                value={searchQuery}
                onChange={(e) => setSearchquery(e.target.value)}
                className='pl-10 p-2 border rounded-2xl text-xl' />
              {/* Search Result */}
              <div className='flex flex-col gap-2 overflow-y-auto'>
                <div className='flex flex-row items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  <h1>RECENT CONVERSATIONS</h1>
                </div>
                {/* Recent Conversation */}
                {filteredChatRooms.length > 0 && (
                  <>
                    {filteredChatRooms.map((chat) =>
                      <div key={chat.id} className='flex flex-row w-full'>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                          {chat.is_group_chat ? (
                            <Users className='w-6 h-6 text-gray-600' />
                          ) : (
                            <User className='w-6 h-6 text-gray-600' />
                          )}
                        </div>
                        <div className={`w-3 h-3 ml-[-0.5rem] mt-9 rounded-full ${getStatusColor(chat.status)} `} />
                        <div className='w-full ml-2'>
                          {chat.is_group_chat ? (
                            <div className='flex justify-between w-full'>
                              <h1>{chat.name}'s Team</h1>
                              <small>{formatTimestamp(chat.last_message.timestamp)}</small>
                            </div>
                          ) : (
                            <div className='flex justify-between'>
                              <h1>{getConversationDisplayName(chat)}</h1>
                              <small>{formatTimestamp(chat.last_message.timestamp)}</small>
                            </div>
                          )}
                          <small>{chat.last_message.content}</small>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className='flex flex-row items-center gap-2'>
                  <User className='h-4 w-4' />
                  <h1>FRIENDS</h1>
                </div>
                {/* Friends */}
                {filteredFriends.length > 0 && (
                  <>
                    {filteredFriends.map((friend) =>
                      <div key={friend.id} className='flex flex-row gap-2 w-full'>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                          <User className='w-6 h-6 text-gray-600' />
                        </div>
                        <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full ${getStatusColor(friend.status)} `} />
                        <div className='w-full'>
                          <div className='flex justify-between'>
                            <h1>{friend.displayName}</h1>
                            <small>{formatTimestamp(friend.last_message.timestamp)}</small>
                          </div>
                          <small>{friend.last_message.content}</small>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div className='flex flex-row items-center gap-2'>
                  <Users className='h-4 w-4' />
                  <h1>ALL USERS</h1>
                </div>
                {/* All Users */}
                {filterAllUsers.length > 0 && (
                  <>
                    {filterAllUsers.map((user) =>
                      <div key={user.id} className='flex flex-row gap-2 w-full'>
                        <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                          <User className='w-6 h-6 text-gray-600' />
                        </div>
                        <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full ${getStatusColor(user.status)} `} />
                        <div className='w-full'>
                          <div className='flex justify-between'>
                            <h1>{user.displayName}</h1>

                          </div>
                          <small className='text-gray-500'>{user.status}</small>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

            </div>
          }
          {/* Create Chat Modal */}
          {!fullSearch &&
            <div
              onClick={(e) => e.stopPropagation()}
              className='bg-white w-1/3 flex flex-col space-y-5 p-6'>
              <div className='flex justify-between m-2'>
                <h1 className='text-bold text-2xl z-10'>Create Group Chat or Direct Message</h1>
                <button onClick={closeModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>

                </button>
              </div>
              <form onSubmit={handleSubmit} className='space-y-5 text-gray-600'>
                <div className='flex flex-col'>
                  <label htmlFor="groupName">Name:</label>
                  <input
                    id="groupName"
                    className='border p-2 rounded-lg'
                    type="text"
                    placeholder='Name of the Group Chat..'
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </div>
                <div className='flex flex-col'>
                  <label htmlFor="groupParticipants">Add Participants:</label>
                  <div className='flex gap-2'>
                    <input
                      id='groupParticipants'
                      className='border p-2 rounded-lg w-5/6'
                      type="text"
                      placeholder='Enter Name or Email'
                      value={participantInput}
                      onChange={(e) => setParticipantInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addParticipant();
                        }
                      }
                      }
                    />
                    <button
                      type='button'
                      onClick={addParticipant}
                      className='text-center bg-teal-500 rounded-lg p-2 px-4 text-white'>
                      Add
                    </button>
                  </div>
                </div>
                {participants.length > 0 && (
                  <div>
                    <p>Participants ({participants.length})</p>
                    <div className='flex flex-row gap-2'>
                      {participants.map((name, index) => (
                        <div key={index} className='bg-teal-100 rounded-2xl text-sm p-1 px-2 flex flex-row justify-between gap-2'>
                          {name}
                          <button
                            type='button'
                            onClick={() => removeParticipant(name)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p>Quick Add Participants:</p>
                  <div className='flex flex-col gap-2 max-h-48 overflow-y-auto'>
                    {mockAllUsers.map(p => (
                      <button
                        key={p.id}
                        onClick={() => addFriend(p)}
                        type='button'
                        className={`${participants.includes(p.displayName) ? "bg-teal-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-100"} flex flex-row justify-between bg-gray-200 p-2 rounded-lg`}>
                        <p>{p.displayName}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>

                      </button>
                    ))}
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label htmlFor="groupDescription">Description (Optional):</label>
                  <input
                    id="groupDescription"
                    className='border p-2 rounded-lg'
                    type="text"
                    placeholder='Description of Chat..'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className='flex flex-row justify-between gap-2'>
                  <button type='button' onClick={() => setModalOpen(false)} className='bg-gray-300 p-2 rounded-lg w-full'>Cancel</button>
                  <button type='submit' className='bg-teal-500 p-2 text-white rounded-lg w-full'>Add Group Chat</button>
                </div>
              </form>
            </div >
          }
        </div >
      }
    </>
  )
}

export default SearchModal