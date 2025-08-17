import { createContext, useState, useEffect, Children } from "react";
import { checkAuth, logoutUser } from "../api/authApi";
export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const authUser = await checkAuth(token); 
                    if (authUser) {
                        setIsLoggedIn(true);
                        setUser(authUser);
                    } else {
                        setIsLoggedIn(false);
                        setUser(null);
                        localStorage.removeItem('authToken'); 
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    setIsLoggedIn(false);
                    setUser(null);
                    localStorage.removeItem('authToken');
                }
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
        };   
        checkAuthStatus();
    }, []);

    const logout = async () => {
        const res = await logoutUser();
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
};