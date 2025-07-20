class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
  }

  async request(endpoint, options = {}) {
    const token = JSON.parse(sessionStorage.getItem("token") || "null");

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

      // Jeśli token wygasł, wyloguj użytkownika
      if (response.status === 401 || response.status === 403) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.reload(); // Przeładuj stronę aby wyświetlić login
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Notes endpoints
  async getNotes(userId) {
    return this.request(`/notes/${userId}`);
  }

  async saveNote(notedata) {
    return this.request("/notes", {
      method: "POST",
      body: JSON.stringify(notedata),
    });
  }

  async updateNote(noteData) {
    return this.request(`/notes/${noteData.id}`, {
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

  async changePassword(newPassword, loggedUserId) {
    return this.request("/user", {
      method: "PATCH",
      body: JSON.stringify({
        newPassword: newPassword,
        loggedUserId: loggedUserId,
      }),
    });
  }

  async deleteUser(userId) {
    return this.request("/user", {
      method: "DELETE",
      body: JSON.stringify({
        userId: userId,
      }),
    });
  }
}

export const apiService = new ApiService();
