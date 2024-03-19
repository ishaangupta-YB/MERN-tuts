import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const getTodos = async () => {
    try {
        const response = await axios.get(`${API_URL}/todos`);
        return response.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const createTodo = async (todo) => {
    try {
        const response = await axios.post(`${API_URL}/todos`, todo);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateTodo = async (id, updatedTodo) => {
    try {
        const response = await axios.put(`${API_URL}/todos/${id}`, updatedTodo);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const deleteTodo = async (id) => {
    try {
        await axios.delete(`${API_URL}/todos/${id}`);
    } catch (err) {
        console.error(err);
    }
};

export const registerUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { email, password })
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message || 'Registration failed');
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password })
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.error || 'Login failed');
    }
};