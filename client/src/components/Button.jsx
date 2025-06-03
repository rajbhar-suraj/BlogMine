import React from 'react'

const Button = ({buttonHandler,buttontext,icon}) => {
 
  return (
    <div className=''>
      <button
        type="button"
        className="bg-black text-white px-5 py-2.5 flex items-center gap-2 rounded-md hover:bg-zinc-700 cursor-pointer"
        onClick={buttonHandler}
      >
        {icon}
        {buttontext}
      </button>
    </div>
  )
}

export default Button