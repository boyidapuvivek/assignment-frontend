// api/hooks/useApiPut.ts
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";


export function usePutApi(endpoint: string) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const put = async (payload: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      throw err;
    }
  };

  return { put, loading, error };
}
