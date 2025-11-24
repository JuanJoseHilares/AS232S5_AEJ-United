import React, { useEffect, useState } from "react";
import { getLanguagesFromApi } from "../api/netflixApi";

const NetflixLen = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getLanguagesFromApi();
                setLanguages(res.data);
            } catch (error) {
                console.error("Error al obtener lenguajes:", error);
                alert("No se pudo obtener la lista de lenguajes");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);

    };

    return (
        <div className="mt-4">
            <h5>Lenguajes Disponibles en Netflix -</h5>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {languages.length > 0 ? (
                            languages.map((lang, i) => (
                                <tr key={i}>
                                    <td>{lang.code || ""}</td>
                                    <td>{lang.name || ""}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => copyToClipboard(lang.code)}
                                        >
                                            Copiar Código
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() => copyToClipboard(lang.name)}
                                        >
                                            Copiar Nombre
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    Cargando...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NetflixLen;