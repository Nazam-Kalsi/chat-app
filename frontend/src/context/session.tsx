import { createContext, useContext, useState } from "react";

type User = {
    id: string;
    name: string;
    email: string;
};

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
}

type UserContextProviderProps = {
    children: React.ReactNode;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});

export const useUser = () => {
    return useContext(UserContext);
};

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
