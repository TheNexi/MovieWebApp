import { useEffect, useState } from "react";
import * as authApi from "../services/auth/authApi";

export function useCheckAuth() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    authApi.isAuthorized()
      .then(() => {
        if (isMounted) {
          setAuthorized(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuthorized(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { loading, authorized };
}
