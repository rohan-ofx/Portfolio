import { useState, useEffect } from "react";
import api from "../services/api.js";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(url);

        if (isActive) {
          setData(response.data.data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err.response?.data?.message ||
              "Failed to fetch data. Please try again."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;