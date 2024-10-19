// auth.js
const API_URL = "http://localhost/back";

export const auth = {
  id_usuario: localStorage.getItem("id_usuario"),
  token: localStorage.getItem("token"),
  is_admin: localStorage.getItem("is_admin"),
  user: (() => {
    const storedUser = localStorage.getItem("user");
    try {
      return storedUser ? JSON.parse(storedUser) : null; // Retorna null si no hay datos
    } catch {
      console.error("Error parsing user from localStorage");
      return null;
    }
  })(),


  async login(username, contraseña) {
    try {
      const response = await fetch(`${API_URL}/auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, contraseña }),
      });

      if (!response.ok) {
        console.log("Error en la respuesta del servidor");
        throw new Error("Login failed");
      }

      const data = await response.json();
      this.token = data.token;

      if (data.usuario) {
        this.user = data.usuario;
        this.id_usuario = data.usuario.id_usuario;
        this.is_admin = data.usuario.is_admin;
      } else {
        console.error("No se encontró el usuario en la respuesta");
      }

      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("id", this.id_usuario);
      localStorage.setItem("is_admin", this.is_admin);

      return user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return false;
  },

  isAuthenticated() {
    // Comparamos la fecha de expiración del token con la fecha actual
    const payload = this.getPayload();
    if (!payload) return false;
    const expirationTime = payload.exp * 1000;
    const isExpired = Date.now() >= expirationTime;
    if (!!this.token && !isExpired) {
      return true;
    }
    this.logout();
  },

  getUsername() {
    const payload = this.getPayload();
    return payload ? payload.username : null;
  },

  getId() {
    const payload = this.getPayload();
    return payload ? payload.id_usuario : null;
  },

  isAdmin() {
    const payload = this.getPayload();
    return payload ? payload.is_admin : null;
  },
  async verifyToken() {
    if (!this.token) return false;

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token verification error:", error);
      this.logout();
      return false;
    }
  },

  getPayload() {
    if (!this.token) return null;
    const arrayToken = this.token.split("."); // Divide el token en 3 partes
    const payload = JSON.parse(atob(arrayToken[1])); // Decodifica la parte del payload
    return payload;
  },
};
