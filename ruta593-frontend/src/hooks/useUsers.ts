import { useEffect, useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { UserT } from "../types";

export default function useUsers() {
  const [loading, setLoading] = useState(false);
  const [dataListUsers, setDataListUsers] = useState<UserT[]>([]);

  const getDrivers = async () => {
    setLoading(true);
    try {
      const res: Response = await fetch(`${API_BASE_URL}users/drivers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      toast.error(verifyError(error));
    } finally {
      setLoading(false);
    }
  };

  const getUsersByDni = async (dni: string) => {
    setLoading(true);
    try {
      const res: Response = await fetch(`${API_BASE_URL}users/${dni}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
  
      const result = await res.json(); // Extraer la respuesta completa
  
      if (!res.ok) {
        if (res.status === 404) {
          return null; // Usuario no encontrado
        }
        throw new Error(result.json.error || "Failed to fetch user data.");
      }
  
      return result.json; // Devolver los datos reales del usuario
    } catch (error) {
      toast.error("Failed to fetch user data.");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const getUsers = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.json;
  } catch (error) {
    toast.error(verifyError(error));
  } finally {
    setLoading(false);
  }
};

const createUser = async (userData: Partial<UserT>) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    toast.success("Usuario creado correctamente");
    return true;
  } catch (error) {
    toast.error(verifyError(error));
    return false;
  } finally {
    setLoading(false);
  }
};

const deleteUser = async (dni: string) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}users/${dni}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error("No se pudo eliminar el usuario");
    toast.success("Usuario eliminado correctamente");
    return true;
  } catch (error) {
    toast.error(verifyError(error));
    return false;
  } finally {
    setLoading(false);
  }
};



  const updateUsers = async (dni: string, updatedData: Partial<UserT>) => {
    setLoading(true);
    try {
      const body = {
        dni,
        ...updatedData, // Incluye los datos proporcionados
      };
    
      const res: Response = await fetch(`${API_BASE_URL}users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user.");
      }
  
      // Muestra un mensaje de éxito
      toast.success("User updated successfully");
      return data; // Devuelve la respuesta de la API
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(verifyError(error));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getDrivers().then((data) => {
      if (data) {
        setDataListUsers(data); // Set the list to the state
      }
    });
  }, []);

  return {
  loading,
  dataListUsers,
  getDrivers,
  updateUsers,
  getUsersByDni,
  getUsers,      // ✅
  createUser,    // ✅
  deleteUser     // ✅
};

}
