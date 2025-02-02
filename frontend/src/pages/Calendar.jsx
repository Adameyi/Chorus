import Sidebar from '../components/Sidebar'
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarGridHeader({ date, onDataChange}) {
    //Get start of week for current date
    const getWeekDays = (current) => {
        const week = []

        // Get Monday of current week
        const monday = new Date(current)
        monday.setDate(monday.getDate()- monday.getDay()+1)
    
        //Generate array of dates for the week
        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(monday)
            dayDate.setDate(monday.getDate() + i)
            week.push(dayDate)
        }

        return week
    }
        const weekDays = getWeekDays(date);
        
        const navigateWeek = (direction) => {
            const newDate = newDate(date);
            newDate.setDate(newDate.getDate() + (direction * 7))
            onDataChange(newDate);
        }
        
    
    return (
     <div>
        
     </div>        
    )
}


function EventCalendar() {
    const [date, setDate] = useState(new Date())

    const handleDataChange = (newDate) => {
        setDate(newDate)
    }

    return (
        <div className="grid grid-cols-4">
            {/* Calendar Menu Panel */}
            <div className="bg-slate-200 h-screen sm:flex hidden flex flex-row">
                <Sidebar />
                <Calendar
                    onChange={handleDataChange}
                    value={date}
                >
                </Calendar>
            </div>
            {/* Events Calendar Display */}
            <div className='col-span-3'>
                {/* Header */}
                <div className='bg-[#93B2B6] p-4 text-white'>
                    <h1 className='font-bold text-2xl flex flex-row gap-2 items-center'>My Calendar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    </h1>
                </div>
                {/*  */}
                <div className='grid grid-cols-7'>
                    
                </div>
            </div>
        </div>
    )
}

export default EventCalendar