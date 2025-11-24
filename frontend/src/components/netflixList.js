import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    getAllLanguages,
    changeLanguageStatus,
    saveLanguageFromApi,
    updateLanguage
} from '../api/netflixApi';

const NetflixList = () => {
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estados para modal
    const [showModal, setShowModal] = useState(false);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        nativeName: "",
        region: ""
    });

    // Mensajes de error o éxito
    const [message, setMessage] = useState("");

    const fetchLanguages = async () => {
        try {
            const res = await getAllLanguages();
            setLanguages(res.data);
        } catch (error) {
            console.error("Error al cargar lenguajes de Netflix:", error);
            setMessage("Error al cargar los lenguajes");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'A' ? 'I' : 'A';
        try {
            await changeLanguageStatus(id, newStatus);
            setLanguages(languages.map(lang =>
                lang.id === id ? { ...lang, estado: newStatus } : lang
            ));
        } catch (error) {
            console.error("Error al cambiar el estado:", error);
            setMessage(error.response?.data?.message || "No se pudo cambiar el estado");
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        // Validación simple
        if (!formData.code || !formData.name) {
            setMessage("El código y el nombre son obligatorios");
            return;
        }

        try {
            if (editingLanguage) {
                // actualizar
                const res = await updateLanguage(editingLanguage.id, formData);
                setMessage(`Idioma "${res.data.name}" actualizado correctamente`);
            } else {
                // crear
                const res = await saveLanguageFromApi(formData);
                setMessage(`Idioma "${res.data.name}" creado correctamente`);
            }
            setShowModal(false);
            setEditingLanguage(null);
            setFormData({ code: "", name: "", nativeName: "", region: "" });
            fetchLanguages();
        } catch (error) {
            console.error("Error al guardar/actualizar:", error);
            setMessage(error.response?.data?.message || "Error al guardar/actualizar el idioma");
        }
    };

    const handleEdit = (lang) => {
        setEditingLanguage(lang);
        setFormData({
            code: lang.code,
            name: lang.name,
            nativeName: lang.nativeName,
            region: lang.region
        });
        setMessage("");
        setShowModal(true);
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    return (
        <div className="container mt-4">
            {/* Botón Crear */}
            <div className="mb-3 text-end">
                <button
                    className="btn btn-success"
                    onClick={() => {
                        setEditingLanguage(null);
                        setFormData({ code: "", name: "", nativeName: "", region: "" });
                        setMessage("");
                        setShowModal(true);
                    }}
                >
                    + Nuevo Idioma
                </button>
            </div>
            {/* Tabla */}
            <div className="table-responsive shadow rounded">
                <table className="table table-striped table-hover table-bordered align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Código</th>
                            <th>Idioma</th>
                            <th>Nombre Nativo</th>
                            <th>Región</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center">Cargando...</td>
                            </tr>
                        ) : languages.length > 0 ? (
                            languages.map((lang) => (
                                <tr key={lang.id}>
                                    <td>{lang.code}</td>
                                    <td>{lang.name}</td>
                                    <td>{lang.nativeName}</td>
                                    <td>{lang.region}</td>
                                    <td>
                                        <span className={`badge ${lang.estado === 'A' ? 'bg-success' : 'bg-danger'}`}>
                                            {lang.estado === 'A' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleEdit(lang)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={() => handleChangeStatus(lang.id, lang.estado)}
                                        >
                                            Cambiar Estado
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay idiomas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show fade d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingLanguage ? "Editar Idioma" : "Nuevo Idioma"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Código</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Idioma</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nombre Nativo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nativeName"
                                        value={formData.nativeName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Región</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                {message && <p className="text-danger">{message}</p>}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NetflixList;