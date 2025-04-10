"use client";
import { useEffect, useState, use } from "react";
import Cookie from "js-cookie";

const useStateTactium = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    const cookieValue = Cookie.get(key);
    return cookieValue ? (JSON.parse(cookieValue) as T) : initialValue;
  });

  useEffect(() => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 12 * 60 * 60 * 1000); // 12 hours

    Cookie.set(key, JSON.stringify(state), {
        expires: expires,
        path: "/"
    });
  }, [key, state]);

  return [state, setState];
};

export default useStateTactium;
