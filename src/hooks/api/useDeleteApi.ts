// api/hooks/useApiDelete.ts
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";


export function useDeleteApi(endpoint: string) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const remove = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { remove, loading, error };
}
