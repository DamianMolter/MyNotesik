class ApiService {
  constructor() {
    this.baseURL = "http://localhost:4000";
  }

  async request(endpoint, options = {}) {
    const token = JSON.parse(localStorage.getItem("token") || "null");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Notes endpoints
  async getNotes(userId) {
    return this.request(`/notes/${userId}`);
  }

  async createNote(noteData) {
    return this.request("/notes", {
      method: "POST",
      body: JSON.stringify(noteData),
    });
  }

  async updateNote(noteId, noteData) {
    return this.request(`/notes/${noteId}`, {
      method: "PUT",
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(noteId) {
    return this.request(`/notes/${noteId}`, {
      method: "DELETE",
    });
  }

  // Auth endpoints
  async login(credentials) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }
}

export const apiService = new ApiService();
