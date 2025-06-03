import React from 'react'


const CommonForm = ({ formControls, formData, changeHandler, submitHandler, loading, buttontext, fileInputRef }) => {

    return (
        <form onSubmit={submitHandler} encType="multipart/form-data" className='w-full flex justify-center items-center relative bottom-[55px]'>
            <div className='bg-white w-full flex flex-col justify-center items-center '>

                {formData.image && typeof formData.image === "string" && (
                    <div className="relative top-20 left-35">
                        <img
                            src={formData.image} // adjust path if needed
                            alt="Current blog"
                            className="w-62 h-10 object-cover rounded-md"
                        />
                    </div>
                )}
                {
                    formControls.map((items) => (
                        <div key={items.name} className='flex flex-col w-1/3 mt-3'>
                            <label className='text-sm text-gray-500 ml-1 mb-1'>{items.label}</label>



                            {
                                items.type === 'file' ? (
                                    <input
                                        type="file"
                                        name={items.name}
                                        accept={items.accept || 'image/*'}
                                        onChange={changeHandler}
                                        className="file:border file:mr-4 file:py-2.5 file:p-4 rounded-md border cursor-pointer focus:outline-none focus:ring-1 disabled:opacity-50 focus:ring-zinc-300"
                                        ref={fileInputRef}
                                    />
                                ) : items.type === 'text-area' ? (
                                    <textarea
                                        onChange={changeHandler}
                                        value={formData[items.name] || ''}
                                        className='w-full border-1 border-col focus:outline-none focus:ring-2 disabled:opacity-50 focus:ring-zinc-800 px-3 py-2.5 rounded-md'
                                        type={items.type}
                                        name={items.name}
                                        rows={4}
                                        placeholder={items.placeholder}
                                        required />
                                ) : items.type === 'checkbox' ? (

                                    <input
                                        onChange={changeHandler}
                                        value={formData[items.name] || ''}
                                        className='w-full border-1 border-col focus:outline-none focus:ring-2 disabled:opacity-50 focus:ring-zinc-800 px-3 py-2.5 rounded-md'
                                        type={items.type}
                                        name={items.name}
                                        placeholder={items.placeholder}
                                        required />
                                ) : (
                                    <input
                                        onChange={changeHandler}
                                        value={formData[items.name] || ''}
                                        className='w-full border-1 border-col focus:outline-none focus:ring-2 disabled:opacity-50 focus:ring-zinc-800 px-3 py-2.5 rounded-md'
                                        type={items.type}
                                        name={items.name}
                                        placeholder={items.placeholder}
                                        required />
                                )
                            }
                        </div>
                    ))
                }
                <button className='w-1/3 bg-black hover:bg-zinc-800 mt-2 text-white rounded-md p-2 font-semibold' type='submit'>{loading ? 'Submitting' : buttontext || 'button'}</button>
            </div>
        </form >


    )
}

export default CommonForm