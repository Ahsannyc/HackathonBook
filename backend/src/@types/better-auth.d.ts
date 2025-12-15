declare module 'better-auth' {
  export interface User {
    id: string;
    email: string;
    name?: string;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
    image?: string;
    [key: string]: any; // Allow additional properties for user background info
  }

  export interface Session {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface AuthClient {
    signIn: (provider: string, credentials?: any) => Promise<any>;
    signOut: () => Promise<any>;
    getSession: () => Promise<{ user: User; session: Session } | null>;
  }

  export interface Auth {
    $ctx: {
      getUserById: (id: string) => Promise<User | null>;
      updateUser: (id: string, data: Partial<User>) => Promise<User | null>;
    };
  }

  export function betterAuth(config: any): any;
  export function getAuthClient(config: any): AuthClient;
}