import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllMovies, changeMovieStatus, createMovie, updateMovie } from '../api/movieApi';
import MovieSearch from './MovieSearch';
import NetflixList from './netflixList';
import NetflixLen from './netflixlen';

const MovieList = () => {
    const [movies, setMovies] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [newMovieName, setNewMovieName] = useState("");
    const [newMovieDescription, setNewMovieDescription] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [showNetflix, setShowNetflix] = useState(false);
    const [showNetflixLen, setShowNetflixLen] = useState(false);

    const fetchMovies = async () => {
        try {
            const res = await getAllMovies();
            setMovies(res.data);
        } catch (error) {
            console.error("Error al cargar las películas:", error);
        }
    };

    const handleEditMovie = (movie) => {
        setEditingMovie(movie);
        setEditName(movie.name);
        setEditDescription(movie.description);
        setMessage("");
    };

    const handleUpdateMovie = async () => {
        if (!editName) {
            setMessage("Debe ingresar un nombre de película");
            return;
        }
        if (!editDescription) {
            setMessage("Debe ingresar una descripción");
            return;
        }

        try {
            const res = await updateMovie(editingMovie.name, editName, editDescription);
            setMovies(movies.map(m => m.id === editingMovie.id ? res.data : m));
            setMessage(`Película "${res.data.name}" actualizada correctamente`);
            setEditingMovie(null);
            setEditName("");
            setEditDescription("");
        } catch (error) {
            setMessage(error.response?.data?.message || "Error al actualizar la película");
        }
    };

    const handleChangeStatus = async (id, newStatus) => {
        try {
            await changeMovieStatus(id, newStatus);
            setMovies(movies.map(m => m.id === id ? { ...m, status: newStatus } : m));
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            alert("No se pudo cambiar el estado");
        }
    };

    const handleCreateMovie = async () => {
        if (!newMovieName) {
            setMessage("Debe ingresar un nombre de película");
            return;
        }
        if (!newMovieDescription) {
            setMessage("Debe ingresar una descripción de la película");
            return;
        }

        try {
            const res = await createMovie(newMovieName, newMovieDescription);
            setMovies([...movies, res.data]);
            setMessage(`Película "${res.data.name}" creada correctamente`);
            setNewMovieName("");
            setNewMovieDescription("");
            setShowModal(false); // cerramos modal
        } catch (error) {
            setMessage(error.response?.data?.message || "Error al crear la película");
        }
    };

    useEffect(() => {
        if (!showSearch && !showNetflix && !showNetflixLen) fetchMovies();
    }, [showSearch, showNetflix, showNetflixLen]);

    return (
        <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light rounded mb-4 shadow">
                <div className="container-fluid">
                    <img
                        src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg"
                        alt="Logo"
                        width="30"
                        height="24"
                        className="d-inline-block align-text-top"
                    />
                    <a className="navbar-brand">Películas Frontend - React</a>

                    <div className="ms-auto d-flex gap-2">
                        {/* Buscar */}
                        {!showSearch && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                    setShowSearch(true);
                                    setShowNetflix(false);
                                    setShowNetflixLen(false);
                                }}
                            >
                                Buscar Película
                            </button>
                        )}
                        {/* NetflixList */}
                        {!showNetflix && (
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => {
                                    setShowNetflix(true);
                                    setShowSearch(false);
                                    setShowNetflixLen(false);
                                }}
                            >
                                Lenguajes Netflix
                            </button>
                        )}
                        {/* NetflixLen */}
                        {!showNetflixLen && (
                            <button
                                className="btn btn-info btn-sm"
                                onClick={() => {
                                    setShowNetflixLen(true);
                                    setShowNetflix(false);
                                    setShowSearch(false);
                                }}
                            >
                                Lenguajes API
                            </button>

                        )}
                        {/* Volver a lista */}
                        {(showNetflix || showNetflixLen || showSearch) && (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                    setShowSearch(false);
                                    setShowNetflix(false);
                                    setShowNetflixLen(false);
                                }}
                            >
                                Lista de Películas
                            </button>
                        )}
                        {/* Crear solo en la lista principal */}
                        {!showSearch && !showNetflix && !showNetflixLen && (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => setShowModal(true)}
                            >
                                Crear Película
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {showNetflix ? (
                <NetflixList />
            ) : showSearch ? (
                <MovieSearch />
            ) : showNetflixLen ? (
                <NetflixLen />
            ) : (
                <div className="table-responsive shadow rounded">
                    <table className="table table-striped table-hover table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Pelicula</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.length > 0 ? (
                                movies.map((movie) => (
                                    <tr key={movie.id}>
                                        <td>{movie.name}</td>
                                        <td>{movie.description}</td>
                                        <td>
                                            <span className={`badge ${movie.status === 'A' ? 'bg-success' : 'bg-danger'}`}>
                                                {movie.status === 'A' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary ms-2"
                                                onClick={() => handleChangeStatus(movie.id, movie.status === 'A' ? 'I' : 'A')}
                                            >
                                                Cambiar Estado
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-warning ms-2"
                                                onClick={() => handleEditMovie(movie)}
                                            >
                                                Actualizar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No hay películas disponibles
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Crear */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Crear Película</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nombre de la película"
                                    value={newMovieName}
                                    onChange={(e) => setNewMovieName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Descripción de la película"
                                    value={newMovieDescription}
                                    onChange={(e) => setNewMovieDescription(e.target.value)}
                                />
                                {message && <p className="text-danger">{message}</p>}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                                <button className="btn btn-success" onClick={handleCreateMovie}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {editingMovie && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Actualizar Película</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingMovie(null)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Nombre de la película"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Descripción de la película"
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                                {message && <p className="text-danger">{message}</p>}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditingMovie(null)}>Cerrar</button>
                                <button className="btn btn-warning" onClick={handleUpdateMovie}>Actualizar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieList;