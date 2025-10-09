/**
 * PURPOSE: Gate client routes until Memberstack confirms session and role
 * CONTEXT: Router enforces redirect paths for login, onboarding, and unauthorized flows
 * DEPENDENCIES: useMemberstack useRouter
 * RELATED_DOCS: @ref: docs/components/ProtectedRoute.md#protected_route_overview
 * OWNERSHIP: web_app
 * DATA_CLASS: internal
 * ORIGIN: ai
 */
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMemberstack } from '../hooks/useMemberstack';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'provider';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { member, loading, role } = useMemberstack();
  const router = useRouter();

  useEffect(() => {
    console.log('ProtectedRoute - Loading:', loading);
    console.log('ProtectedRoute - Member:', member);
    console.log('ProtectedRoute - Role:', role);
    console.log('ProtectedRoute - Required Role:', requiredRole);
    console.log('ProtectedRoute - Current Path:', router.pathname);
    
    if (!loading) {
      if (!member) {
        // Not authenticated, redirect to login
        console.log('ProtectedRoute - Redirecting to login (no member)');
        router.push('/login');
      } else if (!role) {
        // Authenticated but no role, redirect to onboarding
        console.log('ProtectedRoute - Redirecting to onboarding (no role)');
        router.push('/onboarding');
      } else if (requiredRole && role !== requiredRole && role !== 'admin') {
        // Wrong role (admins can access everything), redirect to unauthorized page
        console.log('ProtectedRoute - Redirecting to unauthorized (wrong role)');
        router.push('/unauthorized');
      }
    }
  }, [loading, member, role, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!member || (requiredRole && role !== requiredRole && role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}
