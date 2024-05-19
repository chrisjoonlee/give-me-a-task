import React, { createContext, useState } from 'react';

type StateSetter<T> = (value: T | ((prevValue: T) => T)) => void;

export type UserContextType = {
    userId: string;
    setUserId: StateSetter<string>;
}

const UserContext = createContext<UserContextType>({
    userId: "",
    setUserId: () => { }
});

type UserContextProviderProps = {
    children: React.ReactNode;
}

const UserProvider = ({ children }: UserContextProviderProps) => {
    const [userId, setUserId] = useState<string>("");

    return (
        <UserContext.Provider value={{
            userId, setUserId
        }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };