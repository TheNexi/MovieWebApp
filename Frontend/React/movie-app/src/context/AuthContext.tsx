import { createContext, useContext, useState} from "react";
import type { ReactNode } from "react";

interface AuthContextType {
	user: string | null;
	login: (username: string, token: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<string | null>(() => {
		// Pobierz użytkownika z localStorage jeśli istnieje
		return localStorage.getItem("user");
	});

	const login = (username: string, token: string) => {
		setUser(username);
		localStorage.setItem("user", username);
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
