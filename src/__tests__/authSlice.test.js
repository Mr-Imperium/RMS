import { describe, it, expect } from 'vitest';
import authReducer, { loginUser } from '../../features/auth/authSlice';

describe('Auth Slice', () => {
  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const state = authReducer(undefined, action);
    expect(state.status).toBe('loading');
  });
  
  // You would write more tests for fulfilled and rejected states
});