import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { serverUrl } from "../config";

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    localStorage.getItem("selectedImage") || null
  );

  // ✅ Get current logged-in user
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
    } catch (error) {
      console.log("current-user error:", error?.response?.data || error.message);
    }
  };

  // ✅ Get Gemini AI response
  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log("gemini error:", error?.response?.data || error.message);
      return null;
    }
  };

  // ✅ Logout function
  const logoutUser = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/user/logout`,
        {},
        { withCredentials: true }
      );
      setUserData(null);
      setSelectedImage(null);
      localStorage.removeItem("selectedImage");
    } catch (error) {
      console.log("logout error:", error?.response?.data || error.message);
    }
  };

  // ✅ Persist selectedImage in localStorage
  useEffect(() => {
    if (selectedImage) {
      localStorage.setItem("selectedImage", selectedImage);
    }
  }, [selectedImage]);

  // ✅ Fetch user when component mounts
  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
    handleCurrentUser,
    logoutUser, // 👈 now available in Home.jsx
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;