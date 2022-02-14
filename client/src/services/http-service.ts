import { authService } from "./auth-service";

class HttpError extends Error { }

class HttpService {
  constructor(
    private baseUrl: string
  ) { }

  async get<T>(path: string) {
    return this.request<T>(path, {
      method: 'GET'
    });
  }

  async delete<T>(path: string) {
    return this.request<T>(path, {
      method: 'DELETE'
    });
  }

  async post<T>(path: string, body: { [key: string]: any }) {
    return this.request<T>(path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body)
    });
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const currentAuth = authService.storedUser;

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(currentAuth ?
          { 'authorization': `Bearer ${currentAuth.auth_token}` } :
          {}
        )
      }
    });

    if (!response.ok) {
      throw new HttpError(`Received status code ${response.status}`);
    }

    const responseBody = response.json();

    return responseBody;
  }
}

export const httpService = new HttpService(process.env.REACT_APP_API_URL!);