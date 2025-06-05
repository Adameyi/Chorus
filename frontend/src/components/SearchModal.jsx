import React, { useState } from 'react'

// Mock Messages for debugging
const mockChatRoom = [
  {
    id: 1,
    name: "Test Project",
    participants: [
      { id: 1, username: "john_doe" },
      { id: 2, username: "jane_smith" },
      { id: 3, username: "mike_wilson" },
      { id: 4, username: "sarah_jones" },
    ],
    is_group_chat: true,
    created_at: "2024-05-28T10:00:00Z",
    last_message: {
      content: "Project Deadline has been moved to next Friday",
      sender: "sarah_jones",
      timestamp: "2024-05-29T14:00:00Z",
    }
  },
  {
    id: 2,
    name: null,
    participants: [
      { id: 1, username: "john_doe", displayName: "John Doe" },
      { id: 2, username: "jane_smith", displayName: "Jane Smith" },
    ],
    is_group_chat: false,
    last_message: {
      content: "Can you review the doc I sent?",
      sender: "jane_smith",
      timestamp: "2024-05-19T12:20:00Z",
    }
  },
  {
    id: 3,
    name: "Marketing Team",
    participants: [
      { id: 1, username: "john_doe", displayName: "John Doe" },
      { id: 5, username: "alex_brown", displayName: "Alex Brown" },
      { id: 6, username: "lisa_white", displayName: "Lisa White" },
    ],
    is_group_chat: true,
    last_message: {
      content: "Campaign looks great!",
      sender: "alex_brown",
      timestamp: "2024-05-28T09:30:00Z",
    }
  }
];



const mockMessages = {
  1: [
    {
      id: 1,
      sender: { id: 1, username: "john_doe" },
      content: "Good morning everyone! Let's discuss today's priorities.",
      timestamp: "2024-06-01T09:00:00Z",
      is_read: true
    },
    {
      id: 2,
      sender: { id: 2, username: "jane_smith" },
      content: "I've finished the UI mockups. They're ready for review.",
      timestamp: "2024-06-01T09:15:00Z",
      is_read: true
    },
    {
      id: 3,
      sender: { id: 4, username: "sarah_jones" },
      content: "Great work Jane! I'll review them this afternoon.",
      timestamp: "2024-06-01T09:18:00Z",
      is_read: true
    },
    {
      id: 4,
      sender: { id: 3, username: "mike_wilson" },
      content: "The backend API is almost complete. Should be ready by tomorrow.",
      timestamp: "2024-06-01T10:30:00Z",
      is_read: true
    },
    {
      id: 5,
      sender: { id: 4, username: "sarah_jones" },
      content: "The project deadline has been moved to next Friday",
      timestamp: "2024-06-01T14:30:00Z",
      is_read: false
    }
  ],
  2: [
    {
      id: 6,
      sender: { id: 2, username: "jane_smith" },
      content: "Hi Sarah, I've sent you the design document for review.",
      timestamp: "2024-06-01T13:30:00Z",
      is_read: true
    },
    {
      id: 7,
      sender: { id: 1, username: "john_doe" },
      content: "Thanks! I'll take a look at it shortly.",
      timestamp: "2024-06-01T13:32:00Z",
      is_read: true
    },
    {
      id: 8,
      sender: { id: 2, username: "jane_smith" },
      content: "Can you review the document I sent?",
      timestamp: "2024-06-01T13:45:00Z",
      is_read: false
    }
  ],
}

const mockFriends = [
  { id: 2, username: "jane_smith", displayName: "Jane Smith", status: "online" },
  { id: 3, username: "mike_wilson", displayName: "Mike Wilson", status: "away" },
  { id: 4, username: "sarah_jones", displayName: "Sarah Jones", status: "online" }
];

const mockAllUsers = [
  { id: 5, username: "alex_brown", displayName: "Alex Brown", status: "offline" },
  { id: 6, username: "lisa_white", displayName: "Lisa White", status: "online" },
  { id: 7, username: "david_clark", displayName: "David Clark", status: "away" },
  { id: 8, username: "emma_davis", displayName: "Emma Davis", status: "online" },
  { id: 9, username: "ryan_taylor", displayName: "Ryan Taylor", status: "offline" },
  { id: 10, username: "sophia_wilson", displayName: "Sophia Wilson", status: "online" }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'online': return 'bg-green-500'
    case 'online': return 'bg-yellow-500'
    case 'offline': return 'bg-gray-400'
    default: return 'bg-gray-400'
  }
}

function SearchModal({ setModalOpen, modalOpen, fullSearch }) {
  const [groupName, setGroupName] = useState('')
  const [participantInput, setParticipantInput] = useState('')
  const [participants, setParticipants] = useState([])
  const [description, setDescription] = useState('')

//Filter functions
const filteredChatRooms = useMemo(() => {
  if (!searchQuery) return mockChatRoom

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

  return mockFriends.filter(friend => {
    friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  })
}, [searchQuery])

const filterAllUsers = useMemo(() => {
  if (!searchQuery) return mockFriends

  return mockAllUsers.filter(user => {
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  })
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

  const addFriend = (friend) => {
    if (!participants.includes(friend.name)) {
      setParticipants([...participants, friend.name])
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
        <div className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
          {/*Search Conversations, Users, Friends Modal */}
          {fullSearch &&
            <div className='bg-white w-1/3 flex flex-col space-y-5 p-6'>
              <input
                type="text"
                placeholder='Where would you like to go?' />

              <h1>Recent Conversations</h1>
              <h1>Friends</h1>
              <h1>All Users</h1>
            </div>
          }
          {/* Create Chat Modal */}
          {!fullSearch &&
            <div className='bg-white w-1/3 flex flex-col space-y-5 p-6'>
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
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault().addParticipant())}
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
                    {mockFriends.map(friend => (
                      <button
                        key={friend.id}
                        onClick={() => addFriend(friend)}
                        type='button'
                        className={`${participants.includes(friend.name) ? "bg-teal-100 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-100"} flex flex-row justify-between bg-gray-200 p-2 rounded-lg`}>
                        <p>{friend.name}</p>
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
                    placeholder='Description of Group Chat..'
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