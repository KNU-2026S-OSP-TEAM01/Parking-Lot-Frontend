import axios from "axios";
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export const apiBaseURL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

const axiosApiInstance = axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_ROUTES = ["/login", "/signup"];

const clearAuthSession = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
};

export const getCurrentRedirectPath = () => {
  if (typeof window === "undefined") return "/";

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
};

export const getLoginPathWithRedirect = (redirectPath: string) => {
  const isAuthRoute = AUTH_ROUTES.some((path) => redirectPath.startsWith(path));
  if (!redirectPath || isAuthRoute) return "/login";

  return `/login?redirect=${encodeURIComponent(redirectPath)}`;
};

export const getSafeRedirectPath = (redirect?: string | null) => {
  if (!redirect) return "/";

  try {
    const redirectUrl = new URL(redirect, window.location.origin);
    const redirectPath = `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`;
    const isInternalUrl = redirectUrl.origin === window.location.origin;
    const isAuthRoute = AUTH_ROUTES.some((path) =>
      redirectPath.startsWith(path)
    );

    if (!isInternalUrl || isAuthRoute) return "/";

    return redirectPath;
  } catch {
    return "/";
  }
};

let isRedirectingToLogin = false;

const redirectToLogin = () => {
  if (typeof window === "undefined" || isRedirectingToLogin) return;

  isRedirectingToLogin = true;
  window.location.replace(getLoginPathWithRedirect(getCurrentRedirectPath()));
};

const isCurrentAuthRoute = () => {
  if (typeof window === "undefined") return false;

  return AUTH_ROUTES.some((path) => window.location.pathname.startsWith(path));
};

axiosApiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  }
);

axiosApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isCurrentAuthRoute()) {
      clearAuthSession();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);

export const mutationInstance = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosApiInstance(config);
  return response.data;
};
