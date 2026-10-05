import CONFIG from '../globals/config';

const LANDING_PAGES_URL = `${CONFIG.base_url}landingpages`;

export const getLandingPagesApi = async () => {
  const response = await fetch(LANDING_PAGES_URL, {
    method: 'GET',
    headers: {
      lang: '2',
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();

  if (!response.ok) {
    const error = new Error(
      body?.message || body?.Message || 'Failed to load landing pages.',
    );
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return body;
};
