import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { API_BASE_URL} from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { UserSignUpT } from "../types";


export default function useSignup() {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const login = async (userData: UserSignUpT) => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            localStorage.setItem('ruta593-log', JSON.stringify(data));
            setAuthUser(data);
        } catch (error) {
            toast.error(verifyError(error));
        } finally {
            setLoading(false);
        }
    }
    return { loading, login };
}
