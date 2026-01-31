import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [role, setRole] = useState(() => {
        // Initialize from localStorage if available
        const storedRole = localStorage.getItem('userRole');
        return storedRole || 'student'; // 'student', 'admin', 'faculty'
    });

    useEffect(() => {
        // Save role to localStorage whenever it changes
        localStorage.setItem('userRole', role);
    }, [role]);

    return (
        <UserContext.Provider value={{ role, setRole }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
