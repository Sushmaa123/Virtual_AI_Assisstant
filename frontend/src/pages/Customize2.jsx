import React, { useContext, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../config';

function Customize2() {
  const { userData, backendImage, selectedImage, setUserData } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      // send FormData if there's an image; else send JSON
      if (backendImage || selectedImage) {
        const formData = new FormData();
        formData.append("assistantName", assistantName);
        if (backendImage) formData.append("assistantImage", backendImage);
        if (!backendImage && selectedImage) formData.append("imageUrl", selectedImage);

        const result = await axios.post(`${serverUrl}/api/user/update`, formData, {
          withCredentials: true,
        });
        setUserData(result.data); // backend returns pure user object
      } else {
        const result = await axios.post(`${serverUrl}/api/user/update`, { assistantName }, {
          withCredentials: true,
        });
        setUserData(result.data);
      }

      navigate("/"); // ✅ go home after saving
    } catch (error) {
      console.log("update assistant error:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] relative '>
      <MdKeyboardBackspace className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' onClick={() => navigate("/signin")} />
      <h1 className='text-white mb-[40px] text-[30px] text-center '>Enter Your <span className='text-blue-200'>Assistant Name</span> </h1>
      <input
        type="text"
        placeholder='eg. Shifra'
        className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent  text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className='min-w=[300px] h-[60px] mt-[30px] text-black font-semibold cursor-pointer  bg-white rounded-full text-[19px] px-6'
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Finally Create Your Assistant" : "Loading..."}
        </button>
      )}
    </div>
  );
}

export default Customize2;