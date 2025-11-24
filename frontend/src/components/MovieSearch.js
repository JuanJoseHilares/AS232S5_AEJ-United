import React, { useState } from "react";
import { searchMoviesFromAPI } from "../api/movieApi";

const MovieSearch = () => {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await searchMoviesFromAPI(query);
            setMovies(res.data);
        } catch (error) {
            console.error("Error al buscar películas:", error);
            alert("No se pudo obtener la lista de películas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <h5>Buscar películas desde Disney API</h5>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre de la película"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                    Buscar
                </button>
            </div>

            {loading && <p>Cargando...</p>}

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Año</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.length > 0 ? (
                            movies.map((movie, index) => (
                                <tr key={index}>
                                    <td>{movie.name || ""}</td>
                                    <td>{movie.description || ""}</td>
                                    <td>{movie.release_year || ""}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-warning"
                                            onClick={() => navigator.clipboard.writeText(movie.name || "")}
                                            title="Copiar nombre"
                                        >
                                            Copiar Nombre
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No hay películas
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default MovieSearch;