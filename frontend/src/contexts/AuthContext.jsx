import { createContext, useState, useEffect, Children } from "react";
import { checkAuth } from "../api/authApi";
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const user = await checkAuth();
            setIsLoggedIn(!!user);
        };   
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
};