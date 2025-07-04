import { useState } from "react";

export default function useLogin(url) {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const login = async (object) => {
        setIsLoading(true);
        setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(object),
      });

      const text = await response.text();
      const user = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setError(user.error || "Login failed. No error message returned.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoading(false);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Failed to connect to server.");
      setIsLoading(false);
    }
  };
      return { login, isLoading, error };
}