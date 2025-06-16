import { createContext, useContext, useState } from "react";
import { UserLocalStorageT } from "../types";


type AuthContextProviderProps = {
    children: React.ReactNode; //puede recibir cualquier componente de react como hijo
};

export const AuthContext = createContext({} as any);

//Hook personalizado
export const useAuthContext=()=>{
    //me permite acceder al contexto
    return useContext(AuthContext);
};

//Proporciono el contexto, envolver a los componentes que necesiten acceder a este contexto
export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [authUser, setAuthUser] = useState<UserLocalStorageT>(JSON.parse(localStorage.getItem('ruta593-log') as string) || null);
    
    return <AuthContext.Provider value={{ authUser, setAuthUser }}>
        {children}
    </AuthContext.Provider>
};