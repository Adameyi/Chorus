import React, { useState, useMemo, useEffect } from 'react'
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
  const [searchQuery, setSearchQuery] = useState('')
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
        setCurrentUser(mockUser)

        //Fetch Chat Rooms
        console.log('Fetching Chat rooms...')
        try {
          const chatRoomsResponse = await chatAPI.getChatRooms()
          console.log('Chat Rooms Response:', chatRoomsResponse)
          setChatRooms(chatRoomsResponse.Response?.data || chatRoomsResponse.data || [])
        } catch (chatRoomError) {
          console.error('Error fetching chat rooms:', chatRoomError)
          setChatRooms([]) //Set Chat Rooms as empty array when failed
        }

        // Fetch Friends List
        console.log('Fetching Friends...')
        try {
          const friendsResponse = await friendRequestAPI.getFriends()
          console.log('Friends Response:', friendsResponse)
          setChatRooms(friendsResponse.Response?.data || friendsResponse.data || [])
        } catch (friendsError) {
          console.error('Error fetching friends:', friendsError)
          setFriends([]) //Set Chat Rooms as empty array when failed
        }


        //Fetch all users using search
        console.log('Fetching all users...')
        try {
          const usersResponse = await userAPI.searchUsers('')
          console.log('Search Response:', usersResponse)
          setAllUsers(usersResponse.Response?.data || usersResponse.data || [])
        } catch (searcError) {
          console.error('Error fetching users:', searcError)
          setAllUsers([]) //Set Chat Rooms as empty array when failed
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

  // Search users when search query event changes.
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim()) {
        try {
          console.log('Search users with query:', searchQuery)
          const response = await userAPI.searchUsers(searchQuery)
          console.log('Search users response:', response)
          setAllUsers(response.Response?.data || response.data || [])
        } catch (error) {
          console.log('Error searching users:', error)
        }
      } else {
        // Reset to all users when search is emptied.
        try {
          const response = await userAPI.searchUsers('')
          setAllUsers(response.Response?.data || response.data || [])
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
    return chatRooms.filter(conv => {
      if (conv.is_group_chat && conv.name) {
        return conv.name.toLowerCase().includes(searchQuery.toLowerCase())
      } else {
        //For non-group chats, search through the participant names. Make sure it does not include logged in user's (self) name
        const otherParticipants = conv.participants?.filter(p => p.username !== currentUser?.username)

        return otherParticipants.some(p => (p.displayName || p.display_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
    })
  }, [searchQuery, chatRooms, currentUser])

  const filteredFriends = useMemo(() => {
    if (!searchQuery) return friends

    return friends.filter(friendObj => {
      // friendObj.friend?.displayName && friendObj.friend.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // friendObj.friend?.username?.toLowerCase().includes(searchQuery.toLowerCase())
      const friend = friendObj.friend || friendObj
      const displayName = friend.displayName || friend.display_name || ''
      const username = friend.username || ''

      return displayName.toLowerCase().includes(searchQuery.toLowerCase()) || username.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [searchQuery, friends])

  const filterAllUsers = useMemo(() => {
    if (!searchQuery) return allUsers

    return allUsers.filter(user => {
      // (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase())) || user.username.toLowerCase().includes(searchQuery.toLowerCase())
      const displayName = user.displayName || user.display_name || ''
      const username = user.username || ''

      return displayName.toLowerCase().includes(searchQuery.toLowerCase()) || username.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [searchQuery, allUsers])

  const getConversationDisplayName = (conversation) => {
    if (conversation.is_group_chat && conversation.name) {
      return conversation.name
    } else {
      //For DM chats only, find the other participant
      const otherParticipant = conversation.participants.find(p => p.username !== currentUser?.username)
      return otherParticipant ? (otherParticipant.displayName || otherParticipant.display_name || otherParticipant.username) : "Unknown"
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''
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

  const addUserAsParticipant = (user) => {
    const displayName = user.display_name || user.username
    //Check if Any Paritcipants in the array have an id that matches current user.
    if (!participants.some(p => p.id === user.id)) {
      setParticipants([...participants, { id: user.id, name: displayName }])
    }
  }

  const addParticipant = () => {
    if (participantInput.trim() && !participants.includes(p => p.name === participantInput.trim())) {
      setParticipants([...participants, { id: null, name: participantInput.trim() }])
      setParticipantInput('')
    }
  }

  const removeParticipant = (name) => {
    setParticipants(participants.filter(p => p !== name))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Extract participant IDS - Only for users we found through API.
      const participantIds = participants.filter(p => p.id !== null).map(p => p.id)

      // Ensure participant list isn't empty.
      if (participantIds.length === 0) {
        alert('Please add at least one participant from the user list')
        return
      }

      let response
      if (participantIds.length === 1 && !groupName) {
        //Create DM Only.
        response = await chatAPI.createDirectMessage(participantIds[0])
      } else {
        //Create group chat
        response = await chatAPI.createGroupChat(groupName || 'New Group', participantIds)
      }

      console.log({
        groupName,
        participants,
        description,
      },
        "Chat Created:",
        response.data
      )

      //Reset form
      setGroupName('');
      setParticipants([])
      setDescription('')
      setModalOpen(false)

      //Refresh chat rooms
      const chatRoomsResponse = await chatAPI.getChatRooms()
      setChatRooms(chatRoomsResponse.data || [])
    } catch (error) {
      console.error('Error creating chat:', error)
      alert('Failed to create chat:' + (error.response?.data?.detail || error.message))
    }
  }

  function closeModal() {
    setModalOpen(false)
  }

  // Display loading state
  if (loading) {
    return (
      <div
        onClick={closeModal}
        className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
        <div className='bg-white p-8 rounded-lg'>
          <p>
            Loading...
          </p>
          <button
            onClick={closeModal}
            className='mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // Display error state
  if (error) {
    return (
      <div
        onClick={closeModal}
        className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
        <div className='bg-white p-8 rounded-lg'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button onClick={() => {
            setError(null)
            setLoading(true)

            // Retry data fetch.
            const fetchData = async () => {
              try {
                // Mock current user profile
                const mockUser = {
                  id: 1,
                  username: 'placeholder_user',
                  display_name: 'Placeholder 001',
                  email: 'user@example.com'
                }
                setCurrentUser(mockUser)

                // Retry chat room data fetch.
                try {
                  const chatRoomsResponse = await chatAPI.getChatRooms()
                  setChatRooms(chatRoomsResponse.data || [])
                } catch (chatError) {
                  setChatRooms([])
                }

                // Retry friends fetch.
                try {
                  const friendsResponse = await friendRequestAPI.getFriends()
                  setFriends(friendsResponse?.data || friendsResponse.data || [])
                } catch (chatError) {
                  setFriends([])
                }

                // Retry user fetch.
                try {
                  const searchResponse = await userAPI.searchUsers('')
                  setAllUsers(searchResponse.data || [])
                } catch (searchError) {
                  setAllUsers([])
                }
              } catch (error) {
                setError(`Failed to load data: ${error.response?.data?.message || error.message}`)
              } finally {
                setLoading(false)
              }
            }
            fetchData()
          }}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Retry
          </button>
          <button
            onClick={closeModal}
            className='mt-4 px-4 py-2 bg-gray-300 roudned hover:bg-gray-400'
          >
            Close
          </button>
        </div>
      </div>
    )
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    {filteredChatRooms.slice(0, 5).map((chat) =>
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
                    {filteredFriends.slice(0, 5).map((friendObj, index) => {
                      const friend = friendObj.friend || friendObj
                      const displayName = friend.displayName || friend.display_name || friend.username
                      return (
                        <div key={friend.id || index} className='flex flex-row gap-2 w-full'>
                          <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                            <User className='w-6 h-6 text-gray-600' />
                          </div>
                          <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full ${getStatusColor(friend.status)} `} />
                          <div className='w-full'>
                            <div className='flex justify-between'>
                              <h1>{displayName}</h1>
                              <small>{formatTimestamp(friendObj.last_message.timestamp)}</small>
                            </div>
                            <small>{friend.last_message.content}</small>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
                <div className='flex flex-row items-center gap-2'>
                  <Users className='h-4 w-4' />
                  <h1>ALL USERS</h1>
                </div>
                {/* All Users */}
                {filterAllUsers.length > 0 && (
                  <>
                    {filterAllUsers.slice(0, 5).map((user) => {
                      const displayName = user.displayName || user.display_name || user.username
                      return (
                        <div key={user.id} className='flex flex-row gap-2 w-full'>
                          <div className='w-12 h-12 bg-purple-100 rounded-full flex justify-center items-center'>
                            <User className='w-6 h-6 text-gray-600' />
                          </div>
                          <div className={`w-3 h-3 ml-[-1rem] mt-9 rounded-full ${getStatusColor(user.status)} `} />
                          <div className='w-full'>
                            <div className='flex justify-between'>
                              <h1>{displayName}</h1>

                            </div>
                            <small className='text-gray-500'>{user.status}</small>
                          </div>
                        </div>
                      )
                    })}
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
                    {allUsers.map(user => {
                      const displayName = user.displayName || user.display_name || user.username
                      const isAlreadyAdded = participants.some(p => p.id === user.id)
                      
                      return (
                        <button
                          key={user.id}
                          onClick={() => addUserAsParticipant(user)}
                          disabled={isAlreadyAdded}
                          type='button'
                          className={`${participants.includes(user.displayName) ? "bg-teal-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-100"} flex flex-row justify-between bg-gray-200 p-2 rounded-lg`}>
                          <p>{displayName}</p>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>

                        </button>
                      )
                    })}
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