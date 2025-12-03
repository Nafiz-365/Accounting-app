const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("authToken");
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem("authToken", token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem("authToken");
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// ==================== AUTHENTICATION API ====================

export const authAPI = {
  register: async (name, email, password) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  login: async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      setToken(data.token);
    }
    return data;
  },

  verify: async () => {
    return await apiRequest("/auth/verify");
  },

  logout: () => {
    removeToken();
  },
};

// ==================== ACCOUNTS API ====================

export const accountsAPI = {
  getAll: async () => {
    return await apiRequest("/accounts");
  },

  create: async (code, name, type) => {
    return await apiRequest("/accounts", {
      method: "POST",
      body: JSON.stringify({ code, name, type }),
    });
  },

  update: async (id, code, name, type) => {
    return await apiRequest(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify({ code, name, type }),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/accounts/${id}`, {
      method: "DELETE",
    });
  },

  seedDefaults: async () => {
    return await apiRequest("/accounts/seed-defaults", {
      method: "POST",
    });
  },
};

// ==================== JOURNAL ENTRIES API ====================

export const journalEntriesAPI = {
  getAll: async (isAdjusting = false) => {
    return await apiRequest(`/journal-entries?is_adjusting=${isAdjusting}`);
  },

  create: async (entry) => {
    return await apiRequest("/journal-entries", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  },

  update: async (id, entry) => {
    return await apiRequest(`/journal-entries/${id}`, {
      method: "PUT",
      body: JSON.stringify(entry),
    });
  },

  delete: async (id) => {
    return await apiRequest(`/journal-entries/${id}`, {
      method: "DELETE",
    });
  },
};

export { getToken, setToken, removeToken };
