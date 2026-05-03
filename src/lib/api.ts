class ApiError extends Error {
  response: Response;
  data: any;
  constructor(response: Response, data: any) {
    super(data?.message || 'API Error');
    this.response = response;
    this.data = data;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || "/api";
console.log("HemoTrack API Base URL:", BASE_URL);

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("hemotrack_token");
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as any)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("hemotrack_token");
    localStorage.removeItem("hemotrack_user");
    window.dispatchEvent(new Event("auth-error"));
    throw new Error("Unauthorized");
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(response, data);
  }

  return { data };
}

export const api = {
  get: (url: string) => fetchApi(url, { method: "GET" }),
  post: (url: string, data?: any) => fetchApi(url, { method: "POST", body: JSON.stringify(data) }),
  put: (url: string, data?: any) => fetchApi(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: (url: string) => fetchApi(url, { method: "DELETE" }),
};
