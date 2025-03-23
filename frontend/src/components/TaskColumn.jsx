import React, { useEffect, useState, useRef } from 'react'
import userProfile1 from '../assets/images/profile1.png'
import { taskAPI } from '../services/api'
import { use } from 'react'

function TaskColumn({ columnTitle, columnTasks, handleAddTask }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [openDropdownId, setOpenDropdownId] = useState(null)

  const dropdownRef = useRef(null)

  const toggleDropdown = (taskId) => {
    setOpenDropdownId(prevId => (prevId === taskId ? null : taskId))
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }

  },[])

  useEffect(() => {
    // Fetch tasks when component mounts
    const loadTasks = async () => {
      try {
        setLoading(true)
        const response = await taskAPI.getTasks();
        setTasks(response.data)
      } catch (error) {
        console.error('Error fetching tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [])

  const filteredTasks = tasks.filter(task => task.column === columnTitle)

  // Colour Map
  const tagColors = {
    Database: 'bg-blue-200',
    Design: 'bg-purple-200',
    Backend: 'bg-green-200',
    DevOps: 'bg-yellow-200',
    Documentation: 'bg-orange-200',
    Dev: 'bg-red-200',
    Frontend: 'bg-pink-200',
    Notifications: 'bg-teal-200',
    Hosting: 'bg-indigo-200',
    Automation: 'bg-gray-200'
  };

  return (
    <div className='col-span-1 flex flex-col p-4 overflow-y-auto max-h-[80vh]'>
      {/* Column Heading */}
      <div className='flex flex-row justify-between items-center'>
        <h1 className='text-4xl roboto-bold text-gray-600'><span className='text-red-600'>•</span>{columnTitle}</h1>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      {/* Task Indicator */}
      {loading ? (
        <div className='flex justify-centerp-4'>
          Loading Tasks...
        </div>
      ) : (
        filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id || task.title} className='bg-slate-300 p-4 mt-2 rounded-2xl'>
              <div key={task.id} className='bg-slate-300 p-4 mt-2 rounded-2xl'>
                <div className='flex flex-row justify-between'>
                  <h1 className='roboto-medium text-lg'>{task.title}</h1>

                  <svg
                    onClick={() => toggleDropdown(task.id)}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                  {openDropdownId === task.id && (
            <div className="absolute ml-24 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <ul className="py-1">
                <li 
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => {onEdit(task); setOpenDropdownId(null);}}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </li>
                <li 
                  className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={() => {
                    onDelete(task.id);
                    setOpenDropdownId(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </li>
              </ul>
            </div>
          )}

                </div>
                <p className='m-2 text-sm'>{task.description}</p>
                <div className='flex justify-between'>
                  <div className='flex flex-row'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <div className='border-2 border-slate-500 text-slate-600 rounded-lg p-1 px-2 flex flex-row gap-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    {task.date}
                  </div>
                </div>

                {/* Members + Task Stats */}
                <div className='flex flex-row p-2 justify-between border-t border-slate-600 mt-2'>
                  <div className='flex flex-row'>
                    <img src={userProfile1} alt="Listed User Profile" className='rounded-full w-10 h-10' />
                    <img src={userProfile1} alt="Listed User Profile" className='rounded-full w-10 h-10' />
                    <img src={userProfile1} alt="Listed User Profile" className='rounded-full w-10 h-10' />
                  </div>
                  <div className='flex flex-row gap-4 items-center'>
                    <div className='flex flex-row gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                      </svg>
                      {task.attachments}
                    </div>
                    <div className='flex flex-row gap-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                      </svg>
                      {task.comments}
                    </div>
                  </div>
                </div>
                {/* Tags */}
                <div className='flex flex-row gap-1'>
                  {task.tags.map((tag, tagIndex) =>
                    <div key={tagIndex} className={`${tagColors[tag] || 'bg-gray-400'} p-2 rounded-full text-sm`}>
                      {tag}
                    </div>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center p-4 text-gray-600'>
            No tasks in this column
          </div>
        )
      )}
      <button className='mt-4 p-2 bg-gray-800 text-white rounded-xl flex flex-row gap-2 justify-center' onClick={handleAddTask}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        New Task
      </button>
    </div>
  )
}

export default TaskColumn