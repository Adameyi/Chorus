import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

function EditImageModal({ setImageModalOpen, imageModalOpen, imageName, imageCaption, image, onUpdate }) {
    const [fileName, setFileName] = useState('')
    const [caption, setCaption] = useState('')

    //Update form values on prop change

    useEffect(() => {
        setFileName(imageName || '')
        setCaption(imageCaption || '')
    }, [imageName, imageCaption])

    const handleClose = () => {
        setImageModalOpen(false)
    }

    const handleSave = (e) => {
        e.preventDefault

        // Call onUpdate callback to pass on new values
        if (onUpdate) {
            onUpdate({
                originalName: imageName,
                newName: fileName,
                caption: caption
            })
        }

        handleClose()
    }

    if (!imageModalOpen) return null

    return (
        <>
            {imageModalOpen &&
                <div
                    onClick={() => setImageModalOpen(false)}
                    className='flex justify-center items-center fixed inset-0 bg-gray-600/50 z-20'>
                    {/*Search Conversations, Users, Friends Modal */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className='bg-[#93B2B6] text-white w-full lg:w-1/3 flex flex-col space-y-5 p-6 rounded-lg'
                    >
                        {image && (
                            <>
                                <div className='flex flex-row justify-between mt-[-10vh]'>
                                    <img
                                        src={image}
                                        alt={imageName || 'Preview'}
                                        className=' w-48 h-48 object-cover rounded-lg'
                                    />
                                    <button
                                        onClick={() => setImageModalOpen(false)}
                                        className='text-white hover:text-red-300'
                                    >
                                        <X />
                                    </button>
                                </div>
                                <p className='text-xl font-bold'>{imageName}</p>
                                <form onSubmit={handleSave} className='flex flex-col gap-2'>
                                    <label htmlFor="filename">File Name</label>
                                    <input
                                        name="filename"
                                        type="text"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        placeholder={imageName}
                                        className='placeholder-white/70 bg-teal-600 rounded-lg p-1 px-2'
                                    />
                                    <label htmlFor="caption">Image Caption</label>
                                    <input
                                        name="caption"
                                        type="text"
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="Add Image Captions" 
                                        className='placeholder-white/70 bg-teal-600 rounded-lg p-1 px-2' 
                                    />
                                    <div className='flex gap-4 justify-end mt-2'>
                                        <button onClick={handleClose}>Cancel</button>
                                        <button className='rounded-3xl bg-teal-600 px-4 py-2' type='submit'>Save</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            }
        </>
    )
}

export default EditImageModal