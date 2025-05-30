"use client";
import { useEffect, useState, use } from "react";
import Cookie from "js-cookie";

const useStateTactium = <T>(
  key: string,
  initialValue: T,
  limit: number = 12
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    const cookieValue = Cookie.get(key);
    console.log("Cookie value for key:", key, "is:", cookieValue);
    return cookieValue ? (JSON.parse(cookieValue) as T) : initialValue;
  });

  useEffect(() => {
    const expires = new Date();
    expires.setTime(expires.getTime() + limit * 60 * 60 * 1000);

    Cookie.set(key, JSON.stringify(state), {
      expires: expires,
      path: "/",
    });
  }, [key, state]);

  return [state, setState];
};

export default useStateTactium;
