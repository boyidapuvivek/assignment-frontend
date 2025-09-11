// api/hooks/useApiPost.ts
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";


export function usePostApi(endpoint: string) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const post = async (payload: object) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint, payload, {
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

  return { post, loading, error };
}
