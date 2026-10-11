import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { apiUrl } from '../services/api';

const AUTH_TOKEN_KEY = 'metapro_admin_token';
const AUTH_USER_KEY = 'metapro_admin_user';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: string | null;
  token: string | null;

  login: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;

  loginWithToken: (
    username: string,
    token: string
  ) => void;

  logout: () => void;
}

const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_USER_KEY);
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(token);

  // Verify stored token when the application starts
  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(apiUrl('/api/auth/verify'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          logout();
        }
      })
      .catch(() => {
        // Keep session during temporary network issues
      });
  }, [token]);

  // Admin login
  const login = async (
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      // Remove accidental spaces before/after email or username
      const cleanUsername = username.trim();

      // Validate input
      if (!cleanUsername || !password) {
        return {
          success: false,
          error: 'Username/email and password are required.',
        };
      }

      // Debug information
      // Password and token are intentionally NOT logged.
      console.log('Admin login attempt:', {
        username: cleanUsername,
        usernameLength: cleanUsername.length,
      });

      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: cleanUsername,
          password,
        }),
      });

      const data = await res.json();

      // Debug response
      // Do not log token/password.
      console.log('Admin login response:', {
        status: res.status,
        success: res.ok,
        username: data.username,
        error: data.error,
      });

      // Login failed
      if (!res.ok || !data.token) {
        return {
          success: false,
          error:
            data.error ||
            'Invalid username/email or password.',
        };
      }

      // Save token
      localStorage.setItem(
        AUTH_TOKEN_KEY,
        data.token
      );

      // Save logged-in username
      localStorage.setItem(
        AUTH_USER_KEY,
        data.username || cleanUsername
      );

      // Update React state
      setToken(data.token);
      setAdminUser(
        data.username || cleanUsername
      );

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Admin login error:', error);

      return {
        success: false,
        error:
          error?.message ||
          'Unable to connect to authentication server.',
      };
    }
  };

  // Login using an existing token
  const loginWithToken = (
    username: string,
    newToken: string
  ) => {
    try {
      localStorage.setItem(
        AUTH_TOKEN_KEY,
        newToken
      );

      localStorage.setItem(
        AUTH_USER_KEY,
        username
      );
    } catch {
      // Ignore localStorage errors
    }

    setToken(newToken);
    setAdminUser(username);
  };

  // Logout
  const logout = () => {
    try {
      localStorage.removeItem(
        AUTH_TOKEN_KEY
      );

      localStorage.removeItem(
        AUTH_USER_KEY
      );
    } catch {
      // Ignore localStorage errors
    }

    setToken(null);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        token,
        login,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};