import React from 'react'
import Sidebar from '../components/Sidebar'
import MobileSideBar from '../components/MobileSideBar'

const RecentFiles = [
  { name: "Company_Profile_Overview", type: "docx", size: "10kb", modified: "Aug 2024" },
  { name: "Project_Plan", type: "pdf", size: "25kb", modified: "Sep 2024" },
  { name: "Design_Mockup", type: "png", size: "1.2MB", modified: "Oct 2024" },
  { name: "Meeting_Notes", type: "txt", size: "5kb", modified: "Nov 2024" },
  { name: "Budget_Report", type: "xlsx", size: "450kb", modified: "Dec 2024" },
  { name: "User_Feedback", type: "docx", size: "20kb", modified: "Jan 2025" },
];

const AllFiles = [
  { name: "Company_Profile_Overview.docx", size: "10kb", modified: "Aug 2024", type: "pdf" },
  { name: "Project_Plan.pdf", size: "25kb", modified: "Sep 2024", type: "pdf" },
  { name: "Design_Mockup.png", size: "1.2MB", modified: "Oct 2024", type: "pdf" },
  { name: "Meeting_Notes.txt", size: "5kb", modified: "Nov 2024", type: "pdf" },
  { name: "Budget_Report.xlsx", size: "450kb", modified: "Dec 2024", type: "pdf" },
  { name: "User_Feedback.docx", size: "20kb", modified: "Jan 2025", type: "pdf" },
  { name: "Meeting_Notes.txt", size: "5kb", modified: "Nov 2024", type: "pdf" },
  { name: "Budget_Report.xlsx", size: "450kb", modified: "Dec 2024", type: "pdf" },
  { name: "User_Feedback.docx", size: "20kb", modified: "Jan 2025", type: "pdf" },
];

function Files() {
  return (
    <div className="grid grid-cols-10">
      <div className='hidden sm:flex col-span-2'>
        <Sidebar />
        <div className='bg-slate-100 w-full'>

        </div>
      </div>

      {/* Column 2 */}
      <div className='bg-slate-200 sm:col-span-6 col-span-10 flex flex-col'>
        <div className='sm:h-20 border-b-2 border-slate-400 flex flex-row gap-2 w-full'>
          <MobileSideBar />
          <input
            type="text"
            placeholder='Search Files, Folders, Documents & Images...'
            className='rounded-2xl w-full px-2 m-4'
          />
          <div className='flex flex-row items-center space-x-2 hidden sm:flex'>
            {/* Grid Button (Active) */}
            <div className='bg-white shadow-lg p-1'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            {/* Row Button */}
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 rotate-90">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
              </svg>
            </div>
            {/* Add File Button */}
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>

          </div>
        </div>
        {/* Recent Files Section */}
        <div className='p-4'>
          <h1 className='text-3xl mb-2'>Recent Files</h1>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
            {/* Recent File */}
            {RecentFiles.map((file, index) => (
              <div key={index} className='bg-white shadow-lg flex flex-row p-2 gap-4 lg:text-sm'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <div className='w-full'>
                  <h2>{file.name}.{file.type}</h2>
                  <div className='hidden sm:flex justify-between'>
                    <p>{file.size}</p>
                    <p>Modified • {file.modified}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Starred Files */}
          <h1 className='text-3xl mb-2 mt-8'>Starred Files</h1>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4'>
            {/* All File */}
            {RecentFiles.map((file, index) => (
              <div key={index} className='bg-white shadow-lg flex flex-col p-2 lg:text-sm relative '>
                <div className='flex flex-row justify-end absolute right-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <h2 className='text-lg font-medium'>{file.name}</h2>
                <p className='text-slate-400'>(Jessie) Modified • {file.modified} </p>
                <div className='flex justify-between mt-2 text-slate-400'>
                  <p>{file.size}</p>
                  <p className='uppercase'>{file.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center items-center'>
            <div className='bg-slate-800 text-white px-2 py-3 flex flex-row gap-2'>
              View More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>

          {/* All Files Section */}
          <h1 className='text-3xl mb-2 mt-8'>All Files</h1>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4'>
            {/* All File */}
            {RecentFiles.map((file, index) => (
              <div key={index} className='bg-white shadow-lg flex flex-col p-2 lg:text-sm relative '>
                <div className='flex flex-row justify-end absolute right-0'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <h2 className='text-lg font-medium'>{file.name}</h2>
                <p className='text-slate-400'>(Jessie) Modified • {file.modified} </p>
                <div className='flex justify-between mt-2 text-slate-400'>
                  <p>{file.size}</p>
                  <p className='uppercase'>{file.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center items-center'>
            <div className='bg-slate-800 text-white px-2 py-3 flex flex-row gap-2'>
              View More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-slate-100 col-span-2 hidden sm:flex'>
        col 3
      </div>
    </div>
  )
}

export default Files