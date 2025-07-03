import React from 'react'

const CommonForm = ({ formControls, formData, changeHandler, submitHandler, loading, buttontext, fileInputRef }) => {
    return (
        <form onSubmit={submitHandler} encType="multipart/form-data" className='w-full flex justify-center items-center px-4 py-6 sm:px-6 lg:px-8'>
            <div className='bg-white w-full max-w-3xl flex flex-col justify-center items-center space-y-6'>

                {formData.image && (
                    <div className="relative w-full flex justify-center">
                        <img
                            src={typeof formData.image === "string"
                                ? formData.image
                                : URL.createObjectURL(formData.image)}
                            alt="Preview"
                            className="w-40 h-40 object-cover rounded-md"
                        />
                    </div>
                )}

                {formControls.map((items) => (
                    <div key={items.name} className='flex flex-col w-full sm:w-2/3 mt-3'>
                        <label className='text-sm text-gray-500 ml-1 mb-1'>{items.label}</label>

                        {items.type === 'file' ? (
                            <input
                                type="file"
                                name={items.name}
                                accept={items.accept || 'image/*'}
                                onChange={changeHandler}
                                className="file:border file:mr-4 file:py-2.5 file:px-4 rounded-md border cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-300"
                                ref={fileInputRef}
                            />
                        ) : items.type === 'text-area' ? (
                            <textarea
                                onChange={changeHandler}
                                value={formData[items.name] || ''}
                                className='w-full border focus:outline-none focus:ring-2 focus:ring-zinc-800 px-3 py-2.5 rounded-md'
                                name={items.name}
                                rows={4}
                                placeholder={items.placeholder}
                                required
                            />
                        ) : items.type === 'checkbox' ? (
                            <input
                                onChange={changeHandler}
                                checked={formData[items.name] || false}
                                className='w-5 h-5'
                                type={items.type}
                                name={items.name}
                                required
                            />
                        ) : (
                            <input
                                onChange={changeHandler}
                                value={formData[items.name] || ''}
                                className='w-full border focus:outline-none focus:ring-2 focus:ring-zinc-800 px-3 py-2.5 rounded-md'
                                type={items.type}
                                name={items.name}
                                placeholder={items.placeholder}
                                required
                            />
                        )}
                    </div>
                ))}

                <button className='w-full sm:w-2/3 bg-black hover:bg-zinc-800 mt-4 text-white rounded-md py-2 font-semibold' type='submit'>
                    {loading ? 'Submitting' : buttontext || 'Submit'}
                </button>
            </div>
        </form>
    )
}

export default CommonForm
