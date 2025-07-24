import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Member {
  id: string;
  email?: string; // Email might be at top level
  auth?: {
    email?: string; // Or in auth object
  };
  customFields?: {
    role?: 'admin' | 'provider';
    name?: string;
    phone?: string;
    organization?: string;
    'first-name'?: string;
    'last-name'?: string;
    practice?: string;
    'practice-type'?: string;
  };
  createdAt?: string;
}

export function useMemberstack() {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [memberstack, setMemberstack] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Wait for Memberstack to be initialized
    const initializeMemberstack = async () => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      while (attempts < maxAttempts) {
        if (typeof window !== 'undefined' && (window as any).memberstack) {
          const ms = (window as any).memberstack;
          setMemberstack(ms);
          // Check current member
          await checkMember(ms);
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (attempts === maxAttempts) {
        console.error('Memberstack failed to initialize');
        setLoading(false);
      }
    };
    
    initializeMemberstack();
  }, []);

  const checkMember = async (ms: any) => {
    try {
      const currentMember = await ms.getCurrentMember();
      if (currentMember) {
        console.log('Current member data:', currentMember);
        setMember(currentMember);
        
        // Only do automatic redirects on specific pages
        const role = currentMember.data?.customFields?.role;
        const currentPath = router.pathname;
        
        // Only redirect from login/verify pages if user has a role
        if (role && (currentPath === '/login' || currentPath === '/verify')) {
          if (role === 'admin') {
            router.push('/admin/dashboard');
          } else if (role === 'provider') {
            router.push('/clients');
          }
        }
      }
    } catch (error) {
      console.error('Error checking member:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string) => {
    if (!memberstack) return { error: 'Memberstack not initialized' };
    
    try {
      // Try to send login passwordless email for existing users
      await memberstack.sendMemberLoginPasswordlessEmail({ email });
      return { success: true, passwordlessSent: true };
    } catch (error: any) {
      console.error('Login attempt failed, trying signup:', error);
      
      // If login fails (user doesn't exist), try signup
      try {
        await memberstack.sendMemberSignupPasswordlessEmail({ email });
        return { success: true, passwordlessSent: true };
      } catch (signupError: any) {
        console.error('Signup error:', signupError);
        return { error: signupError.message || 'Failed to send verification email' };
      }
    }
  };

  const verifyCode = async (token: string) => {
    if (!memberstack) return { error: 'Memberstack not initialized' };
    
    try {
      const email = sessionStorage.getItem('login_email');
      if (!email) {
        return { error: 'Email not found. Please start over.' };
      }
      
      // Try login first for existing users
      try {
        const result = await memberstack.loginMemberPasswordless({
          passwordlessToken: token,
          email: email
        });
        
        if (result.data?.member) {
          setMember(result.data.member);
          // Check if member needs onboarding
          const role = result.data.member.data?.customFields?.role;
          if (!role) {
            router.push('/onboarding');
          } else if (role === 'admin') {
            router.push('/admin/dashboard');
          } else if (role === 'provider') {
            router.push('/clients');
          }
          return { success: true, member: result.data.member };
        }
      } catch (loginError) {
        console.log('Login failed, trying signup:', loginError);
        
        // If login fails, try signup for new users
        const result = await memberstack.signupMemberPasswordless({
          passwordlessToken: token,
          email: email
        });
        
        if (result.data?.member) {
          setMember(result.data.member);
          // New users always need onboarding
          router.push('/onboarding');
          return { success: true, member: result.data.member };
        }
      }
      
      return { error: 'Invalid verification code' };
    } catch (error: any) {
      console.error('Verification error:', error);
      return { error: error.message || 'Invalid verification code' };
    }
  };

  const updateMember = async (data: { email?: string; customFields?: any }) => {
    if (!memberstack || !member) return { error: 'Not authenticated' };
    
    try {
      // If only customFields are provided (for backward compatibility)
      if (!data.email && !data.customFields) {
        data = { customFields: data };
      }
      
      const result = await memberstack.updateMember(data);
      setMember(result.member);
      return { success: true, member: result.member };
    } catch (error: any) {
      return { error: error.message || 'Update failed' };
    }
  };

  const logout = async () => {
    if (!memberstack) return;
    
    try {
      await memberstack.logout();
      setMember(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    member,
    loading,
    login,
    verifyCode,
    updateMember,
    logout,
    isAuthenticated: !!member,
    role: member?.data?.customFields?.role,
  };
}
