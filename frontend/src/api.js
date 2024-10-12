import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';  // Replace with your backend URL if hosted on another server

// Fetch all users
export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Claim random points for a user
export const claimPoints = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/claim/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error claiming points:', error);
        throw error;
    }
};

// Fetch leaderboard
export const fetchLeaderboard = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/leaderboard`);
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};

// Fetch claim history
export const fetchClaimHistory = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/history`);
        return response.data;
    } catch (error) {
        console.error('Error fetching claim history:', error);
        throw error;
    }
};
