import React, { useState } from "react"

const taggedUsers = [
    "David Beck", "John Cleo",]

function Tag() {
    const [isHovered, setIsHovered] = useState(false)


    return (
        <div className='flex flex-row gap-2'>
            {taggedUsers.map((user) =>
                <div className='bg-teal-100 px-2 py-1 rounded-lg w-28 flex justify-between'
                    key={user} 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {user}{isHovered && <button>x</button>}
                </div>
            )}
        </div>
    )
}

export default Tag