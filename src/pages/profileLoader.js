export const profileLoader = async ({ params }) => {
  const { slug } = params;
  const token = localStorage.getItem('token');
  const res = await fetch('https://realworld.habsida.net/api/profiles/' + slug, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error('Profile not found.');
  }

  return res.json();
};
