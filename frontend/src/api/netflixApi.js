import axios from 'axios';

const API_URL = `${process.env.REACT_APP_APIURL}/v1/api/netflix/languages`;

// Obtener todos los lenguajes desde Mongo
export const getAllLanguages = () => axios.get(`${API_URL}/db/GetAll`);

// Cambiar estado (A/I)
export const changeLanguageStatus = (id, status) =>
    axios.patch(`${API_URL}/db/changeStatus/${id}?status=${status}`);

// Guardar un lenguaje desde la API externa (si existe)
export const saveLanguageFromApi = (language) =>
    axios.post(`${API_URL}/db/save`, language);

// Actualizar un lenguaje
export const updateLanguage = (id, updatedData) =>
    axios.put(`${API_URL}/db/update/${id}`, updatedData);

// Obtener todos los lenguajes desde la API externa (solo consulta)
export const getLanguagesFromApi = () =>
    axios.get(`${API_URL}/api`);