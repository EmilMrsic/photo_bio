import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface MemberCustomFields {
  role?: 'admin' | 'provider';
  name?: string;
  phone?: string;
  organization?: string;
  'first-name'?: string;
  'last-name'?: string;
  practice?: string;
  'practice-type'?: string;
}

interface Member {
  id: string;
  email?: string; // Email might be at top level
  auth?: {
    email?: string; // Or in auth object
  };
  customFields?: MemberCustomFields; // Some responses include fields at the top level
  data?: {
    id?: string;
    auth?: {
      email?: string;
    };
    customFields?: MemberCustomFields;
    createdAt?: string;
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
      const maxAttempts = 20; // 2 seconds max wait (reduced for faster dev experience)
      
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
        console.warn('Memberstack not available - running without authentication');
        setLoading(false);
      }
    };
    
    initializeMemberstack();
  }, []);

  const checkMember = async (ms: any) => {
    try {
      const currentPath = router.pathname;

      // Don't auto-authenticate on login/verify pages - user is trying to login
      if (currentPath === '/login' || currentPath === '/verify') {
        console.log('On login/verify page, skipping auto-authentication');
        setLoading(false);
        return;
      }

      // Check if user explicitly logged out - if so, don't auto-authenticate
      if (typeof window !== 'undefined') {
        const hasLoggedOut = localStorage.getItem('memberstack_logged_out');
        if (hasLoggedOut === 'true') {
          console.log('User has logged out, skipping auto-authentication');
          setLoading(false);
          return;
        }
      }

      const currentMember = await ms.getCurrentMember();

      // Only set member if they have valid data
      if (currentMember && currentMember.data && currentMember.data.id) {
        console.log('Current member data:', currentMember);
        setMember(currentMember);

        // Clear logout flag since user is authenticated
        if (typeof window !== 'undefined') {
          localStorage.removeItem('memberstack_logged_out');
        }

        // User is authenticated with valid data
        console.log('User is authenticated:', currentMember.data.id);
      } else {
        console.log('No valid member data found');
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
      console.error('Full error object:', JSON.stringify(error, null, 2));

      // If login fails (user doesn't exist), try signup
      try {
        await memberstack.sendMemberSignupPasswordlessEmail({ email });
        return { success: true, passwordlessSent: true };
      } catch (signupError: any) {
        console.error('Signup error:', signupError);
        console.error('Full signup error:', JSON.stringify(signupError, null, 2));
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

      // Clear logout flag when user logs in
      if (typeof window !== 'undefined') {
        localStorage.removeItem('memberstack_logged_out');
      }

      // Check if we have prefetched provider data with practice field
      const hasPractice = sessionStorage.getItem('has_practice') === 'true';
      const prefetchedProvider = sessionStorage.getItem('prefetched_provider');

      console.log('[Verification] Has practice:', hasPractice);
      console.log('[Verification] Prefetched provider exists:', !!prefetchedProvider);

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

          // SKIP ONBOARDING if provider has practice field in Xano
          if (hasPractice) {
            console.log('[Verification] Skipping onboarding - provider has practice');
            window.location.href = '/clients'; // Force full page redirect to avoid URL issues
          } else if (!role) {
            router.replace('/onboarding');
          } else if (role === 'admin') {
            router.replace('/admin/dashboard');
          } else if (role === 'provider') {
            router.replace('/clients');
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

          // Check if this is actually an existing provider with practice data
          if (hasPractice && prefetchedProvider) {
            console.log('[Verification] New signup but provider exists with practice - redirecting to clients');
            // Update Memberstack with provider role
            try {
              const providerData = JSON.parse(prefetchedProvider);
              await memberstack.updateMember({
                customFields: {
                  role: 'provider',
                  'first-name': providerData.first_name,
                  'last-name': providerData.last_name,
                  practice: providerData.practice,
                  'practice-type': providerData.practice_type,
                }
              });
            } catch (updateError) {
              console.error('[Verification] Failed to update Memberstack with provider data:', updateError);
            }
            window.location.href = '/clients'; // Force full page redirect to avoid URL issues
          } else {
            // New users without practice need onboarding
            router.replace('/onboarding');
          }
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

    // FIRST: Set logout flag BEFORE clearing anything
    if (typeof window !== 'undefined') {
      localStorage.setItem('memberstack_logged_out', 'true');
    }

    try {
      // Call memberstack logout to clear their session
      await memberstack.logout();

      // CRITICAL: Force Memberstack to fully reset by clearing the instance
      if ((window as any).memberstack) {
        delete (window as any).memberstack;
      }
    } catch (error) {
      console.error('Memberstack logout error:', error);
    }

    // Clear state immediately
    setMember(null);
    setMemberstack(null);

    // Clear any cached data (but keep the logout flag)
    if (typeof window !== 'undefined') {
      // Save the logout flag
      const logoutFlag = localStorage.getItem('memberstack_logged_out');

      // Clear ALL localStorage
      localStorage.clear();

      // Restore the logout flag
      if (logoutFlag) {
        localStorage.setItem('memberstack_logged_out', logoutFlag);
      }

      // Clear ALL sessionStorage
      sessionStorage.clear();

      // Clear all cookies including domain-level cookies
      const cookies = document.cookie.split(";");
      for (let cookie of cookies) {
        const cookieName = cookie.split("=")[0].trim();
        // Clear for current path
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        // Clear for root domain
        const domain = window.location.hostname;
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + domain;
        // Clear without domain
        document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      // Clear IndexedDB which Memberstack might use
      if (window.indexedDB) {
        try {
          const dbs = await window.indexedDB.databases();
          dbs.forEach(db => {
            if (db.name) {
              window.indexedDB.deleteDatabase(db.name);
            }
          });
        } catch (e) {
          console.error('Error clearing IndexedDB:', e);
        }
      }
    }

    // Add a small delay to ensure everything is cleared
    await new Promise(resolve => setTimeout(resolve, 200));

    // Redirect to login page instead of home
    window.location.replace('/login');
  };

  return {
    member,
    loading,
    login,
    verifyCode,
    updateMember,
    logout,
    isAuthenticated: !!member && !!member.data && !!member.data.id,
    role: member?.data?.customFields?.role,
  };
}
