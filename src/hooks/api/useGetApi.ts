import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const useGetApi = (endpoint: string, params?: object) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const { token } = useAuth();

  useEffect(() => {
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: params || {},
        });
        setResponse(res);
        console.log("❤️ API data fetched", res.data);
      } catch (err) {
        console.log("❌ API error", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (token && endpoint) {
      fetchData();
    }
  }, [endpoint, params, token]);

  return { response, error, loading };
};

export default useGetApi;
