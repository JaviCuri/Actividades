import { useParams, useNavigate } from "react-router-dom";
import accessData from "../data/fakeAccessData";

const AccessInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const accessInfo = accessData.find((entry) => entry.id === id);

    if (!accessInfo) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl mb-4">Acceso no encontrado</h1>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => navigate("/")}
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Acceso Registrado</h1>
            <p className="text-lg mb-2"><strong>Usuario:</strong> {accessInfo.user}</p>
            <p className="text-lg mb-4"><strong>Oficina:</strong> {accessInfo.office}</p>
            <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => navigate("/")}
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default AccessInfo;
