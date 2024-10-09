import React from 'react'

function Accordion({ title, children, isActive, onShow }) {
    return (
        <>
            <section className='p-2 mt-2 border-b text-gray-500 w-full bg-white rounded-tr-md rounded-tl-md flex flex-row justify-between'>
                <h3>{title}</h3>
                {isActive ? (
                    <button onClick={onShow}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                        </svg>
                    </button>
                ) : (
                    <button onClick={onShow}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>
                )}
            </section>
            {isActive &&
                <div className='bg-white'>
                    {children}
                </div>
            }
        </>
    )
}

export default Accordion