import { createContext, useContext, useState } from "react";

type User = {
    _id: string;
    userName: string;
    email: string;
    description: string;

};

interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
    loading:boolean
    setLoading:(v:boolean)=>void
}

type UserContextProviderProps = {
    children: React.ReactNode;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading:true,
    setLoading:()=>{}
});

export const useUser = () => {
    return useContext(UserContext);
};

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    return (
        <UserContext.Provider value={{ user, setUser,loading,setLoading }}>
            {children}
        </UserContext.Provider>
    );
};
