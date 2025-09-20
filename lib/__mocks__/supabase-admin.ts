export const supabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    insert: jest.fn(() => ({ error: null })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        order: jest.fn(() => ({ data: [], error: null })),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({ error: null, data: [] })),
      })),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({ error: null, data: [] })),
      })),
    })),
  })),
};