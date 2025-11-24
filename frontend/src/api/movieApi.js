import axios from 'axios';

const API_URL = `${process.env.REACT_APP_APIURL}/v1/api/RapidAPI`;

export const getAllMovies = () => axios.get(`${API_URL}/Disney/GetAll`);

export const changeMovieStatus = (id, status) => axios.patch(`${API_URL}/Disney/Mongo/changeStatus/${id}?status=${status}`);

export const searchMoviesFromAPI = (name) => axios.get(`${API_URL}/Disney/API/searchFull/${name}`);

export const createMovie = (name, description) => {
    return axios.post(`${API_URL}/Disney/save`, { name, description });
};

export const updateMovie = (oldName, name, description) => 
    axios.put(`${API_URL}/Disney/Mongo/update`, { oldName, name, description });