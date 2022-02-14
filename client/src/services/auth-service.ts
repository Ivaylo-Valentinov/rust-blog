import { httpService } from "./http-service";

export interface UserAuth {
  name: string;
  email: string;
  auth_token: string;
  id: number;
}

type UserChangeHandler = (user: UserAuth | null) => void;

class AuthService {
  private handler: UserChangeHandler | null = null;

  set changeHandler(handler: UserChangeHandler | null) {
    this.handler = handler;
  }

  get storedUser(): UserAuth | null {
    const auth = localStorage.getItem('authentication');

    if (!auth) {
      return null;
    }

    return JSON.parse(auth);
  }

  private setCurrentUser(user: UserAuth | null) {
    if (user) {
      localStorage.setItem('authentication', JSON.stringify(user));
    } else {
      localStorage.removeItem('authentication');
    }
    this.handler?.(user);
  }

  async login(email: string, password: string) {
    const authResult = await httpService.post<UserAuth>('/auth', { email, password });
    this.setCurrentUser(authResult);
  }

  logout() {
    this.setCurrentUser(null);
  }

  async register(username: string, email: string, password: string, confirmedPassword: string) {
    if (password !== confirmedPassword) {
      throw new Error('Confirmed password is different from password!');
    }
    return httpService.post<UserAuth>('/users', { name: username, email, password });
  }

}

export const authService = new AuthService();
