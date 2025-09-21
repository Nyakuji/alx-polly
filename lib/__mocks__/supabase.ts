export const supabase = {
  auth: {
    getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => Promise.resolve({ error: null })),
    update: jest.fn(() => ({
      match: jest.fn(() => Promise.resolve({ error: null })),
    })),
    delete: jest.fn(() => ({
      match: jest.fn(() => Promise.resolve({ error: null })),
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  })),
};