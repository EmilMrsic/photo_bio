# In Progress Features and Known Issues

## Passwordless Login with Verification Code

**Status**: Not Working - Needs Investigation

**Issue**: The Memberstack passwordless login with verification code is not functioning properly. The email sends successfully and the user receives a verification code, but the verification step fails.

**Error**: 
```
Runtime TypeError: memberstack.loginPasswordless is not a function
```

**What we've tried**:
- `memberstack.loginPasswordless({ token, email })`
- `memberstack.verifyPasswordlessOTP({ otp, email })`
- `memberstack.loginMemberPasswordless({ passwordlessToken, email })`

**Next Steps**:
- Need to check Memberstack documentation for the correct method name
- May need to contact Memberstack support to understand their code-based verification API
- Alternative: Use their magic link approach instead of verification codes

**Temporary Workaround**: 
- Users can use Google login
- Or implement traditional email/password authentication

**File affected**: `/pages/login.tsx`

---

## Other Known Issues

(None at this time)
