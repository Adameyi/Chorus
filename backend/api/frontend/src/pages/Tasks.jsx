import React, { useState, useEffect } from 'react';
import { taskAPI } from '../services/api'
import Sidebar from '../components/Sidebar'
import TaskColumn from '../components/TaskColumn'
import AddTaskImg from '../assets/images/duckBuilder.png'
import Tag from '../components/Tag'

function Tasks() {
    const [addTaskVisible, setAddTaskVisible] =  useState(false)  
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        column: 'To Do',
        date: '',
        due_date: new Date().toISOString(),
        tags: [],
        order: 0,
        participants: []
    })

    //Fetch tasks when component mounts
    useEffect(() => {
        loadTasks();
    }, [])

    //Get Tasks
    const loadTasks = async () => {
        try {
            setLoading(true)
            const response = await taskAPI.getTasks();
            setTasks(response.data);
        } catch (error) {
            setError('Failed to load tasks. Please try again later.')
            console.error('Error Fetching Tasks', error)
        } finally {
            setLoading(false);
        }
    }

    //Add a New Task
    const handleAddTask = async (event) => {
        event.preventDefault();
        try {
            const taskData = {
                title: formData.title,
                description: formData.description,
                column: formData.column,
                date: formData.date,
                due_date: formData.due_date,
                tags: formData.tags,
                order: formData.order,
            };
            const response = await taskAPI.createTask(taskData);

            // Log to ensure taskData is correctly constructed
            console.log('taskData:', taskData);
            console.log('New Task:', response.data);
            // setTasks((prevTasks) => Array.isArray(prevTasks) ? [...prevTasks, newTask] : [newTask]);
            setTasks((prevTasks) => [...prevTasks, response.data]);

            // Reset form and close modal after successful creation
            resetForm();
            closeAddTask();
        } catch (error) {
            console.error('Error adding task:', error);
            setError('Failed to create task. Please try again later.');
        }
    };

    // Reset form to initial state
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            column: 'To Do',
            date: '',
            due_date: new Date().toISOString(),
            tags: [],
            order: 0,
            participants: []
        });
    };

    // Handle input changes for all form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //Update Task
    const handleUpdateTask = async (taskId, updatedData) => {
        try {
            const response = await taskAPI.updateTask(taskId, updatedData)
            setTasks(prevTasks =>
                prevTasks.map(task => 
                    task.id === taskId ? response.data : task
                )
            )
        } catch (error) {
            setError('Failed to update task. Please try again later')
            console.error('Error updating task:', error)
        }
    }

    //Relocate task to different column
    const handleMoveTask = async (taskId, newColumn) => {
        try {
            const response = await taskAPI.moveTask(taskId, newColumn)
            setTasks(prevTasks =>
                // prevTasks.map(task => task.id === taskId ? {...task, column: newColumn} : task)
                prevTasks.map(task => task.id === taskId ? response.data : task)
            )
        } catch (error) {
            setError('Failed to move task. Please try again later')
            console.error('Error moving task:', error)
        }
    }

    //Delete Task
    const handleDeleteTask = async (taskId) => {
        try {
            await taskAPI.deleteTask(taskId)
            setTasks(prevTasks =>
                prevTasks.filter(task => task.id !== taskId)
            ) 
        } catch (error) {
            setError('Failed to delete task. Please try again later')
            console.error('Error deleting task:', error)
        }
    }

    const handleDateTimeChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'date') {
            setFormData(prev => ({
                ...prev,
                date: value
            }));
        } else if (name === 'time') {
            // Combine date and time to update due_date
            const dateTime = combineDateTime(formData.date, value);
            setFormData(prev => ({
                ...prev,
                due_date: dateTime.toISOString()
            }));
        }
    }

    const combineDateTime = (dateStr, timeStr) => {
        // Parse the date and time strings
        const [monthName, day] = dateStr.split(' ');
        const monthIndex = months.indexOf(monthName);
        const year = new Date().getFullYear();
        
        // Parse time (e.g., "6:00AM")
        let hours = parseInt(timeStr.match(/\d+/)[0]);
        const minutes = timeStr.includes(':') ? parseInt(timeStr.split(':')[1].match(/\d+/)[0]) : 0;
        const isPM = timeStr.includes('PM');
        
        // Convert to 24-hour format
        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        
        return new Date(year, monthIndex, parseInt(day), hours, minutes);
    }

    // Add a participant
    const handleAddParticipant = (e) => {
        e.preventDefault();
        const participant = formData.newParticipant;
        if (participant && !formData.participants.includes(participant)) {
            setFormData(prev => ({
                ...prev,
                participants: [...prev.participants, participant],
                newParticipant: ''
            }));
        }
    }

    // Add a tag
    const handleAddTag = (tag) => {
        if (tag && !formData.tags.includes(tag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
    }

    // Remove a participant
    const handleRemoveParticipant = (participant) => {
        setFormData(prev => ({
            ...prev,
            participants: prev.participants.filter(p => p !== participant)
        }));
    }

    // Remove a tag
    const handleRemoveTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tag)
        }));
    }

    const openAddTask = () => {
        setAddTaskVisible(true)
    }

    const closeAddTask = () => {
        setAddTaskVisible(false)
        resetForm();
    }

    const columns = ['To Do', 'In Progress', 'Completed']
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
    const days = Array.from({ length: 31 }, (_, i) => i + 1)

    return (
        <div className="grid grid-cols-6">
            <div className="bg-slate-200 h-screen sm:flex hidden flex flex-row">
                <Sidebar />
            </div>
            <div className='col-span-5 bg-slate-100'>
                {/* Header */}
                <div className='bg-[#93B2B6] text-white w-full'>
                    <div className='flex flex-row p-4 items-center justify-between'>
                        <div className='flex flex-row gap-3 items-center justify-between'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>

                            <h1 className='font-bold text-3xl'>Risk Management Tasks</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        <div className='flex flex-row gap-2 hidden sm:flex'>
                            <button className='flex flex-row gap-2 border-2 bg-teal-600 rounded-xl p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                </svg>
                                Share
                            </button>
                            <button className='flex flex-row gap-2 border-2 bg-teal-600 rounded-xl p-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                </svg>
                                New Project
                            </button>
                        </div>
                    </div>
                </div>
                {/* Header End */}

                {/* Search Bar + Task Options */}
                <div className='flex flex-row justify-between items-center text-gray-400 p-2'>
                    <div className='flex flex-row justify-between items-center '>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search Tasks & Columns..."
                            className='outline-none ring-0 roboto-light p-2 pl-8 text-3xl bg-slate-100'
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                        </svg>
                    </div>
                    <div className='flex flex-row gap-2 text-gray-500'>
                        <button className='flex flex-row gap-2 text-gray-500 border-2 border-slate-400 rounded-xl p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                            </svg>
                            Filter & Sort
                        </button>
                        <button className='flex flex-row gap-2 text-gray-500 border-2 border-slate-400 rounded-xl p-2' onClick={openAddTask}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            New Task
                        </button>
                        <button className='flex flex-row gap-2 text-gray-500 border-2 border-slate-400 rounded-xl p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            New Column
                        </button>
                    </div>
                </div>
                {/* Search Bar + Task Options End */}

                {/* Task Columns + Tasks */}
                <div className='grid grid-cols-1 sm:grid-cols-4'>
                    {columns.map((column, index) =>
                        <TaskColumn 
                        key={index} 
                        columnTitle={column} 
                        tasks={tasks}
                        openAddTask={openAddTask}
                        onAddTask={handleAddTask}
                        onMoveTask={handleMoveTask}
                        onDeleteTask={handleDeleteTask}
                        />
                    )}
                    <div className='flex flex-col text-center items-center justify-center h-full w-full rounded-lg p-4 gap-3'>
                        <p className='roboto-bold text-2xl'>Get Started</p>
                        <img src={AddTaskImg} alt="" />
                        <p className='text-sm'>Create new columns to manage and organize tasks & events!</p>
                        <button className='bg-teal-500 px-2 py-1 rounded-lg text-white'>Create Task Column</button>
                    </div>
                </div>
                {/* Task Columns + Tasks End */}

                {/* Add Task Modal */}
                <div className={`absolute flex flex-row right-10 bottom-10 bg-teal-500 rounded-2xl ${addTaskVisible ? 'sm:h-[75vh]': 'hidden'}`}>
                    <h1 className='text-white robot-bold text-3xl m-4'>New<br />Task</h1>
                    <div className='bg-white'>
                        
                        {/* Close Button */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 absolute right-3 top-3" onClick={closeAddTask}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                        <form onSubmit={handleAddTask} className='flex flex-col p-4 pt-8 gap-2'>
                            <label htmlFor="title">Title:</label>
                            <input 
                                type="text" 
                                id='title' 
                                name='title'
                                placeholder='Add Task Title' 
                                className='border-b-2 bg-gray-100'
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                            />
                            
                            <label htmlFor="column">Column:</label>
                            <div>
                                <select 
                                    className="m-1 bg-teal-500 text-white p-1" 
                                    name="column" 
                                    value={formData.column}
                                    onChange={handleInputChange}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            
                            <label htmlFor="date">Date:</label>
                            <div>
                                <select 
                                    className="m-1 bg-teal-500 text-white p-1" 
                                    name="date"

                                    value={formData.date}
                                    onChange={handleDateTimeChange}
                                    required
                                >
                                    <option value="" disabled>Select date</option>
                                    {months.flatMap(month =>
                                        days.map(day => (
                                            <option key={`${month} ${day}`} value={`${month} ${day}`}>
                                                {month} {day}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <select 
                                    className="m-1 bg-teal-500 text-white p-1" 
                                    name="time" 
                                    defaultValue="6:00AM"
                                    onChange={handleDateTimeChange}
                                >
                                    {[
                                        "12:00AM", "12:30AM", "1:00AM", "1:30AM", "2:00AM", "2:30AM", "3:00AM", "3:30AM",
                                        "4:00AM", "4:30AM", "5:00AM", "5:30AM", "6:00AM", "6:30AM", "7:00AM", "7:30AM",
                                        "8:00AM", "8:30AM", "9:00AM", "9:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM",
                                        "12:00PM", "12:30PM", "1:00PM", "1:30PM", "2:00PM", "2:30PM", "3:00PM", "3:30PM",
                                        "4:00PM", "4:30PM", "5:00PM", "5:30PM", "6:00PM", "6:30PM", "7:00PM", "7:30PM",
                                        "8:00PM", "8:30PM", "9:00PM", "9:30PM", "10:00PM", "10:30PM", "11:00PM", "11:30PM"
                                    ].map(time => (
                                        <option key={time} value={time}>{time}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <label htmlFor="participants">Participants:</label>
                            <div className='flex justify-between'>
                                <input 
                                    type="text" 
                                    id='newParticipant' 
                                    name='newParticipant' 
                                    placeholder='Add User' 
                                    className='border-b-2 bg-gray-100 w-40'
                                    value={formData.newParticipant || ''}
                                    onChange={handleInputChange}
                                />
                                <button 
                                    className='bg-teal-500 p-1 rounded-lg'
                                    onClick={handleAddParticipant}
                                    type="button"
                                >
                                    Add
                                </button>
                            </div>
                            
                            <div className='flex flex-row gap-2 flex-wrap'>
                                {formData.participants.map((participant, index) => (
                                    <div key={index} className='bg-teal-100 p-1 rounded-lg'>
                                        {participant}
                                        <button 
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => handleRemoveParticipant(participant)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                {formData.participants.length === 0 && (
                                    <>
                                    </>
                                )}
                            </div>
                            
                            <Tag onTagSelect={handleAddTag} />
                            
                            <label htmlFor="tags">Tags:</label>
                            <div className='flex flex-row gap-2 flex-wrap'>
                                {formData.tags.map((tag, index) => (
                                    <div key={index} className='bg-teal-100 p-1 rounded-lg'>
                                        {tag}
                                        <button 
                                            type="button"
                                            className="ml-2 text-red-500"
                                            onClick={() => handleRemoveTag(tag)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <label htmlFor="description">Description:</label>
                            <textarea 
                                name="description" 
                                id="description" 
                                placeholder="Add Description" 
                                value={formData.description}
                                onChange={handleInputChange}
                                className="border-b-2 bg-gray-100" 
                                rows="5"
                            >
                            </textarea>
                            
                            <div className='flex justify-end'>
                                <button 
                                    type="submit"
                                    className='p-1 bg-teal-500 w-24 text-white rounded-lg'
                                >
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tasks