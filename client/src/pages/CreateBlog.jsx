import React, { useRef, useState, useEffect } from 'react'
import Navbar from '../components/NavBar';
import CommonForm from '../components/CommonForm';
import { blogControls } from '../config';
import { useBlogContext } from '../contexts/blogContext/BlogContext'


const CreateBlog = () => {
  const { createBlogs, loading,setLoading, edited, editBlog, setEdited } = useBlogContext()

  const [formdata, setFormData] = useState({})
  const fileInputRef = useRef(null);


  function changeHandler(e) {

    const { name, value, files } = e.target

    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
      console.log('File selected:', files[0]);

    } else {
      setFormData(prev => ({ ...prev, [name]: value }))

    }
  }

  useEffect(() => {
    if (edited) {
      setFormData({ _id: edited._id, title: edited.title, content: edited.content, image: edited.image })

    } else {
      setFormData({})
    }
  }, [edited])

  async function submitHandler(e) {

    e.preventDefault()
    if (edited) {
      console.log("Edited blog:", edited);

      const formDataToSend = new FormData();

      formDataToSend.append("title", formdata.title);
      formDataToSend.append("content", formdata.content);
      if (formdata.image instanceof File) {
        formDataToSend.append("image", formdata.image);
      } else {
        console.log("❌ Image is not a valid File object:", formdata.image);
      }
      await editBlog(formDataToSend,formdata._id)
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
        setFormData({})
        setEdited(null)

      }

    } else {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formdata.title);
      formDataToSend.append("content", formdata.content);

      if (formdata.image instanceof File) {
        formDataToSend.append("image", formdata.image);
      } else {
        console.log("❌ Image is not a valid File object:", formdata.image);
      }
      await createBlogs(formDataToSend)
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input
        setFormData({})
        setLoading(false)
      }
    }
  }
  return (
    <div>
      <Navbar />

      <div>
        <h2 className="text-2xl font-bold  text-zinc-700 mt-10 flex flex-col justify-center items-center">
          Share Your Story with the World
        </h2>
        <p className="text-sm text-center text-zinc-500">
          Fill in the details below to create a new blog post.
        </p>
        <div className='flex justify-center'>
          <img
            src='https://imgs.search.brave.com/u2lfBUXu6yOURQMAgsybAagpvXjjMTgEVPy0G9LktU4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vSE9PYUo4/LUlya2RmZzhkUWxh/Wm00cU5LR0ZHOGh4/R0RiaW9JSTQ3a2tD/SS9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTl0/WldScC9ZUzVwYzNS/dlkydHdhRzkwL2J5/NWpiMjB2YVdRdk1U/TXovTVRnNE1qTXpP/QzkyWldOMC9iM0l2/WTNWMFpTMXJiMkZz/L1lTMXdaV1ZyYVc1/bkxXTmgvY25SdmIy/NHRkbVZqZEc5eS9M/V2xzYkhWemRISmhk/R2x2L2JpNXFjR2Nf/Y3owMk1USjQvTmpF/eUpuYzlNQ1pyUFRJ/dy9KbU05Um14NWNq/WTJabXA1L04wbzVl/akJPUkc1SlVHRTUv/ZW1kbGIybzVVWEZR/ZDNsQi9XWGN6Y0hr/NGRtVlRWVDA'
            alt="bear icon"
            className="w-45 h-40"
          />
        </div>
        <CommonForm
          formControls={blogControls}
          formData={formdata}
          changeHandler={changeHandler}
          buttontext={edited ? "Edit" : "Create"}
          submitHandler={submitHandler}
          loading={loading}
          fileInputRef={fileInputRef}

        />
      </div>
    </div>
  )
}

export default CreateBlog