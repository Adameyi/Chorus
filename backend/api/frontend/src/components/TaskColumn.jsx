import React, { useEffect, useState, useRef } from 'react'
import userProfile1 from '../assets/images/profile1.png'
import { taskAPI } from '../services/api'

function TaskColumn({ columnTitle, tasks, openAddTask, onMoveTask, onDeleteTask }) {
  //   const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [error, setError] = useState(null)

  const columnTasks = tasks.filter(task => task.column === columnTitle)

  //Dropdown menu for task options
  const toggleDropdown = (taskId) => {
    if (openDropdownId === taskId) {
      setOpenDropdownId(null)
    } else {
      setOpenDropdownId(taskId)
    }
  }

  //Close dropdown when clicking outside of it
  useEffect(() => {
    const closeDropdown = () => setOpenDropdownId(null)
    document.addEventListener('click', closeDropdown)
    return () => document.removeEventListener('click', closeDropdown)

  }, [])

  //Handle Task Deletion
  const handleDeleteTask = (e, taskId) => {
    e.stopPropagation() //Prevent event bubbling
    onDeleteTask(taskId)
  }

  //Handle moving task to other oclumns
  const handleMoveTask = (e, taskId, newColumn) => {
    e.stopPropagation()
    onMoveTask(taskId, newColumn)
    setOpenDropdownId(null) //Close dropdown after action
  }


  const filteredTasks = tasks.filter(task => task.column === columnTitle)

  // Colour Map
  const getHeaderColor = (task = { column: columnTitle }) => {
    switch (task.column) {
      case 'To Do':
        return 'bg-red-200';
      case 'In Progress':
        return 'bg-yellow-200';
      case 'Completed':
        return 'bg-green-200';
      default:
        return 'bg-gray-200';
    }
  };

  const getTaskStatusColor = (task = { column: columnTitle }) => {
    switch (task.column) {
      case 'To Do':
        return 'bg-red-500';
      case 'In Progress':
        return 'bg-yellow-500';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  return (
    <div className="flex flex-col p-2">
      {/* Column Header */}
      <div className={`flex justify-between items-center p-2 rounded-t-lg ${getHeaderColor()}`}>
        <h2 className="font-bold text-lg">{columnTitle}</h2>
        <div className="flex items-center">
          <span className="mr-2">{columnTasks.length}</span>
          <button
            onClick={openAddTask}
            className="p-1 hover:bg-gray-300 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2 mt-2">
        {loading ? (
          <div className="p-4 text-center">Loading tasks...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : columnTasks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No tasks in this column</div>
        ) : (
          columnTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-white rounded-lg shadow-md relative"
            >
              {/* Task header with dropdown */}
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleDropdown(task.id)
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {openDropdownId === task.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        {/* Move to other columns */}
                        {['To Do', 'In Progress', 'Completed'].filter(col => col !== task.column).map(column => (
                          <button
                            key={column}
                            onClick={(e) => handleMoveTask(e, task.id, column)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Move to: {column}
                          </button>
                        ))}

                        {/* Edit option */}
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit task
                        </button>

                        {/* Delete option */}
                        <button
                          onClick={(e) => handleDeleteTask(e, task.id)}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Task status indicator */}
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${getTaskStatusColor(task)}`}></div>
                <span className="text-sm text-gray-600">{columnTitle}</span>
              </div>

              {/* Task description */}
              <p className="text-gray-700 mb-3">{task.description}</p>

              {/* Task due date */}
              {task.due_date && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {formatDate(task.due_date)}
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Participants/Assignees */}
              {task.participants && task.participants.length > 0 && (
                <div className="flex items-center mt-3">
                  {task.participants.map((participant, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center -ml-1 first:ml-0 text-xs"
                      title={participant}
                    >
                      {participant.substring(0, 1).toUpperCase()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TaskColumn