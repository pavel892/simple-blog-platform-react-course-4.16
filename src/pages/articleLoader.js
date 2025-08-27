export const articleLoader = async ({ params }) => {
  const { slug } = params;
  const res = await fetch('https://realworld.habsida.net/api/articles/' + slug);

  if (!res.ok) {
    throw Error('Article not found.');
  }

  return res.json();
};
