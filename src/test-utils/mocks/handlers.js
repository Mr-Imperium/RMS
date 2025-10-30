import { rest } from 'msw';

// Replace with your actual Supabase URL
const SUPABASE_URL = 'https://<your-project-ref>.supabase.co';

export const handlers = [
  // Mock handler for a Supabase login request
  rest.post(`${SUPABASE_URL}/auth/v1/token`, (req, res, ctx) => {
    const { email } = req.body;
    if (email === 'test@example.com') {
      return res(
        ctx.status(200),
        ctx.json({
          access_token: 'fake-token',
          user: { id: 'user-123', email: 'test@example.com' },
        })
      );
    }
    return res(ctx.status(400), ctx.json({ message: 'Invalid credentials' }));
  }),

  // Mock handler for fetching candidates
  rest.get(`${SUPABASE_URL}/rest/v1/candidates`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: '1', given_name: 'John', family_name: 'Doe', passport_no: 'P123' },
        { id: '2', given_name: 'Jane', family_name: 'Smith', passport_no: 'P456' },
      ])
    );
  }),
];