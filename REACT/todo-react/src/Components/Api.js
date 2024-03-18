import axios from 'axios';

const API_URL = 'http://localhost:8080/api/todos';

export const getTodos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const createTodo = async (todo) => {
    try {
        const response = await axios.post(API_URL, todo);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const updateTodo = async (id, updatedTodo) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, updatedTodo);
        return response.data;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const deleteTodo = async (id) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
        console.error(err);
    }
};