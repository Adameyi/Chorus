import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

import logo from '../assets/images/logo.png'
import userPlaceholder from '../assets/images/userPlaceholder.png'

function MobileSideBar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const sidebarRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false)
            }
        }

        //Event Listener
        document.addEventListener('mousedown', handleClickOutside)

        //Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const Trigger = () => (
        < button className="flex justify-center items-center h-24 w-20 bg-teal-500 lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)
        }>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button >

    )


    return (
        <>
            <Trigger />
            {isSidebarOpen && (
                <div className='absolute w-80 bg-teal-600 text-white'>
                    <div className='flex flex-row justify-between px-4 pt-2'>
                        <img src={logo} alt="Chorus Logo" className='h-14 w-12'></img>
                        <div className='text-center' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            <p>Close</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default MobileSideBar