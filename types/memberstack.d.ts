interface MemberstackMember {
  loggedIn: boolean;
  id?: string;
  auth?: {
    email: string;
  };
}

interface Memberstack {
  onReady: Promise<MemberstackMember>;
  loginWithProvider: (options: { provider: string }) => Promise<any>;
  sendMemberSignupPasswordlessEmail: (options: { 
    email: string; 
    redirectUrl: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
}

declare global {
  interface Window {
    memberstack?: Memberstack;
  }
}

export {};
