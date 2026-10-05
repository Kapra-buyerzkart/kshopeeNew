const { getUserIdFromToken, decodeJwtPayload } = require('../src/utils/jwt');

describe('Auth & JWT Helpers', () => {
  const createTestJwt = payload => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return `${header}.${body}.sig`;
  };

  it('extracts numeric userId from sub claim', () => {
    const token = createTestJwt({ sub: '12345' });
    expect(getUserIdFromToken(token)).toBe(12345);
  });

  it('extracts userId from nameid claim', () => {
    const token = createTestJwt({ nameid: '67890' });
    expect(getUserIdFromToken(token)).toBe(67890);
  });

  it('extracts userId from WS-Federation nameidentifier claim', () => {
    const token = createTestJwt({
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': '99999',
    });
    expect(getUserIdFromToken(token)).toBe(99999);
  });

  it('preserves non-numeric UUIDs without throwing NaN', () => {
    const token = createTestJwt({ sub: 'usr-uuid-abcdef-12345' });
    expect(getUserIdFromToken(token)).toBe('usr-uuid-abcdef-12345');
  });

  it('returns null for null/empty token or missing identity claims', () => {
    expect(getUserIdFromToken(null)).toBeNull();
    expect(getUserIdFromToken('')).toBeNull();
    expect(getUserIdFromToken(createTestJwt({ someOtherField: 'foo' }))).toBeNull();
  });
});
