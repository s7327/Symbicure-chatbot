import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const currencySymbol = '₹';
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

    const getDoctosData = async () => {
        console.log("Attempting to fetch doctors from:", backendUrl + '/api/doctor/list'); // Log URL
        if (!backendUrl) {
            console.error("VITE_BACKEND_URL is not defined in .env file.");
            toast.error("Backend URL not configured.");
            return;
        }
        try {
            const response = await axios.get(backendUrl + '/api/doctor/list');
            console.log("Raw response from /api/doctor/list:", response); // Log raw response

            const responseData = response.data; // Get the data object from the response
            console.log("Data received from /api/doctor/list:", responseData); // Log the parsed data

            if (responseData && responseData.success) {
                // --- FIX HERE: Access the doctors array via responseData.data ---
                setDoctors(responseData.data || []); // Use responseData.data, fallback to empty array
                console.log(`Successfully fetched and set ${responseData.data?.length || 0} doctors.`);
            } else {
                // Log error if success is false or data structure is unexpected
                console.error("Failed to fetch doctors or unexpected data format:", responseData?.message || 'No message');
                toast.error(responseData?.message || "Failed to fetch doctors list (API error).");
                setDoctors([]); // Ensure doctors is empty on failure
            }
        } catch (error) {
            console.error("Error fetching doctors:", error.response || error.message || error); // Log detailed error
             // Check if it's an Axios error with a response
             if (error.response) {
                 toast.error(`Failed to fetch doctors list. Status: ${error.response.status} - ${error.response.data?.message || 'Server error'}`);
             } else if (error.request) {
                 // The request was made but no response was received
                 toast.error("Failed to fetch doctors list. No response from server.");
             } else {
                 // Something happened in setting up the request
                 toast.error("Failed to fetch doctors list. Network or configuration error.");
             }
             setDoctors([]); // Ensure doctors is empty on network/request error
        }
    };

    const loadUserProfileData = async (currentToken) => {
        if (!currentToken || !backendUrl) {
             if (!currentToken) {
                 setUserData(null);
                 setUserId(null);
                 localStorage.removeItem('userId');
             }
             return;
         }
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token: currentToken } });
            if (data.success) {
                setUserData(data.userData);
                if (data.userData?._id) {
                     if (localStorage.getItem('userId') !== data.userData._id) {
                         localStorage.setItem('userId', data.userData._id);
                     }
                     setUserId(data.userData._id);
                }
            } else {
                console.warn("Load profile warning:", data.message);
                 setUserData(null);
                 setUserId(null);
                 localStorage.removeItem('userId');
                 localStorage.removeItem('token');
                 setToken('');
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
             if (error.response?.status === 401) {
                 setUserData(null);
                 setUserId(null);
                 localStorage.removeItem('userId');
                 localStorage.removeItem('token');
                 setToken('');
             }
        }
    };

    // Effect to load initial data
    useEffect(() => {
        getDoctosData(); // Fetch doctors

        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (storedToken) {
            setToken(storedToken);
            if (storedUserId) setUserId(storedUserId);
            loadUserProfileData(storedToken);
        } else {
            setUserData(null);
            setUserId(null);
        }
    }, []);

    // Effect to reload profile if token changes
    useEffect(() => {
        // Only run if token genuinely changes after initial load
        if (token !== localStorage.getItem('token') && token) {
             loadUserProfileData(token);
         } else if (!token && userData) { // Handle logout case
             setUserData(null);
             setUserId(null);
             localStorage.removeItem('userId');
         }
    }, [token]);


    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        userId, setUserId
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;