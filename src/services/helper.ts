import axios from "axios";


const api = axios.create({ baseURL: '/api' });


const getAllLibros = async () => {
  try {
    const response = await api.get('/libros');
    return response.data;
  } catch (er) {
    console.error("Error al obtener libros:", er);
    return [];
  }
};

const getLibroById = async (id: number) => {
  try {
    const response = await api.get(`/libros/${id}`);
    return response.data;
  } catch (er) {
    console.error(`Error al obtener el libro con ID ${id}:`, er);
    return null;
  }
};


const createLibro = async (libro: any) => {
  try {
    const response = await api.post('/libros', libro);
    return response.data;
  } catch (er) {
    console.error("Error al crear libro:", er);
    return null;
  }
};


const updateLibro = async (id: number, libroUpdated: any) => {
  try {
    const response = await api.put(`/libros/${id}`, libroUpdated);
    return response.data;
  } catch (er) {
    console.error("Error al actualizar libro:", er);
    return null;
  }
};


const patchLibro = async (id: number, libroUpdated: any) => {
  try {
    const response = await api.patch(`/libros/${id}`, libroUpdated);
    return response.data;
  } catch (er) {
    console.error("Error al editar libro:",er);
    return null;
  }
};


const deleteLibro = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/libros/${id}`);
    console.log("Status de borrado:", response.status);
    return response.status === 204 || response.status === 200;
  } catch (er) {
    console.error("Error al borrar libro:", er);
    return false;
  }
};


const helper = {
  getAllLibros,
  getLibroById,
  createLibro,
  patchLibro,
  updateLibro,
  deleteLibro
};

export default helper;
