import { AuthTokens, JournalEntry, AnalyticsOverview } from '../types';

const BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  private access: string | null = localStorage.getItem('echo_access');
  private refresh: string | null = localStorage.getItem('echo_refresh');

  private async request(path: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    if (this.access) {
      headers.set('Authorization', `Bearer ${this.access}`);
    }
    headers.set('Content-Type', 'application/json');

    let response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

    // Handle Token Refresh
    if (response.status === 401 && this.refresh) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        headers.set('Authorization', `Bearer ${this.access}`);
        response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'API Request Failed');
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const res = await fetch(`${BASE_URL}/accounts/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: this.refresh }),
      });
      if (res.ok) {
        const data: AuthTokens = await res.json();
        this.setTokens(data);
        return true;
      }
    } catch (e) {
      console.error('Refresh token failed', e);
    }
    this.logout();
    return false;
  }

  setTokens(tokens: AuthTokens) {
    this.access = tokens.access;
    this.refresh = tokens.refresh;
    localStorage.setItem('echo_access', tokens.access);
    localStorage.setItem('echo_refresh', tokens.refresh);
  }

  logout() {
    this.access = null;
    this.refresh = null;
    localStorage.removeItem('echo_access');
    localStorage.removeItem('echo_refresh');
  }

  isAuthenticated() {
    return !!this.access;
  }

  // Auth
  async login(username: string, password: string): Promise<AuthTokens> {
    const data = await this.request('/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setTokens(data);
    return data;
  }

  // Journals
  async getEntries(): Promise<JournalEntry[]> {
    return this.request('/journals/entries/');
  }

  async getEntry(id: string): Promise<JournalEntry> {
    return this.request(`/journals/entries/${id}/`);
  }

  async createEntry(data: { title: string; intensity: number; responses: any }): Promise<JournalEntry> {
    return this.request('/journals/entries/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    return this.request(`/journals/entries/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: string): Promise<void> {
    return this.request(`/journals/entries/${id}/`, { method: 'DELETE' });
  }

  async togglePin(id: string): Promise<void> {
    return this.request(`/journals/entries/${id}/toggle_pin/`, { method: 'POST' });
  }

  async reflect(id: string): Promise<{ entry: JournalEntry }> {
    return this.request(`/journals/entries/${id}/reflect/`, { method: 'POST' });
  }

  // Analytics
  async getAnalytics(): Promise<AnalyticsOverview> {
    return this.request('/analytics/overview/');
  }
}

export const api = new ApiService();
