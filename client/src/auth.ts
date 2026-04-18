// auth.ts — GitHub OAuth popup flow.

import type { APIClient } from "./api";
import type { OverlayConfig } from "./config";

export interface AuthUser {
  login: string;
  avatarUrl: string;
}

const AUTH_MESSAGE_TYPE = "feedback_overlay_auth";

export class AuthManager {
  private user: AuthUser | null = null;
  private config: OverlayConfig;
  private api: APIClient;
  private messageHandler: ((e: MessageEvent) => void) | null = null;

  constructor(config: OverlayConfig, api: APIClient) {
    this.config = config;
    this.api = api;
    // Try to restore session from sessionStorage.
    this.api.loadToken();
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.api.isAuthenticated();
  }

  /**
   * Restores the user from a valid stored token by calling /me.
   * Returns true if the token is still valid.
   */
  async tryRestoreSession(): Promise<boolean> {
    if (!this.api.isAuthenticated()) return false;
    try {
      const me = await this.api.getMe();
      this.user = { login: me.login, avatarUrl: me.avatar_url };
      return true;
    } catch {
      this.api.clearToken();
      return false;
    }
  }

  /**
   * Opens the GitHub OAuth popup. Resolves when the user completes auth
   * (via postMessage from the callback page) or rejects on timeout/cancel.
   */
  login(): Promise<AuthUser> {
    return new Promise((resolve, reject) => {
      const authUrl = `${this.config.apiBase}/auth/github`;
      const popup = window.open(
        authUrl,
        "feedback_overlay_auth",
        "width=600,height=700,left=200,top=100"
      );

      if (!popup) {
        reject(new Error("Popup was blocked. Please allow popups for this site."));
        return;
      }

      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Authentication timed out."));
      }, 5 * 60 * 1000); // 5 minutes

      const handler = (e: MessageEvent) => {
        if (e.data?.type !== AUTH_MESSAGE_TYPE) return;
        clearTimeout(timeout);
        cleanup();

        const { token, login, avatar } = e.data as {
          type: string;
          token: string;
          login: string;
          avatar: string;
        };
        this.api.setToken(token);
        this.user = { login, avatarUrl: avatar };
        resolve(this.user);
      };

      const cleanup = () => {
        window.removeEventListener("message", handler);
        this.messageHandler = null;
        if (!popup.closed) popup.close();
      };

      this.messageHandler = handler;
      window.addEventListener("message", handler);

      // Poll for popup closure (user closed without completing auth).
      const poll = setInterval(() => {
        if (popup.closed) {
          clearInterval(poll);
          if (this.messageHandler === handler) {
            cleanup();
            clearTimeout(timeout);
            reject(new Error("Authentication cancelled."));
          }
        }
      }, 500);
    });
  }

  logout(): void {
    this.user = null;
    this.api.clearToken();
  }
}
