import { useEffect, useState } from 'react';
import PageTitle from '../../components/PageTitle';
import useUsers from '../../hooks/useUsers'; // usa tu hook personalizado si ya lo tienes
import { FaTrashAlt } from 'react-icons/fa';

const UserRegistration = () => {
    const [users, setUsers] = useState<any[]>([]);
    const { getUsers } = useUsers(); // ← asegúrate que esté definido en tu hook
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await getUsers?.(); // depende de cómo esté implementado tu hook
        if (result) setUsers(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="p-4">
            <PageTitle title="Registro de Usuarios" />
            <h2 className="text-xl font-semibold mb-4">Lista de Usuarios</h2>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="w-[100%] border text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Rol</th>
                            <th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-2">{user.id}</td>
                                <td className="p-2">{user.name}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">{user.role}</td>
                                <td className="p-2">
                                    <button className="text-red-600 hover:text-red-800">
                                        <FaTrashAlt />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserRegistration;
