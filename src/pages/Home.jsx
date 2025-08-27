import Banner from '../components/Banner/Banner';
import Sidebar from '../components/Sidebar/Sidebar';
import Post from '../components/Post/Post';
import Loader from '../components/Loader';
import PaginationBar from '../components/PaginationBar/PaginationBar';
import { useEffect, useState } from 'react';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 5;
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(total / limit); i++) {
    pageNumbers.push(i);
  }

  function handlePageClick(pageNumber) {
    setPage(pageNumber);
  }

  useEffect(() => {
    async function fetchArticles() {
      setIsLoading(true);
      setArticles([]);
      try {
        const offset = (page - 1) * limit;
        const res = await fetch(`https://realworld.habsida.net/api/articles/?offset=${offset}&limit=${limit}`);

        if (!res.ok) {
          throw Error('Articles not found.');
        }

        const jsonResponse = await res.json();
        const articles = jsonResponse.articles;
        const total = jsonResponse.articlesCount;
        setArticles(articles);
        setTotal(total);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArticles();
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
    <div>
      <Banner
        mainContent="Realworld Blog"
        additionalContent="A place to share your knowledge."
        mainTextStyle={{
          fontSize: '56px',
          textShadow: '1px 1px 8px rgba(0, 0, 0, 0.3)',
        }}
        style={{
          backgroundColor: '#61BB61',
          height: '190px',
          boxShadow: 'inset 0 0 24px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      />

      <div style={{ marginTop: '20px' }}>
        <Sidebar />
      </div>

      {isLoading && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Loader />
        </div>
      )}

      {error && <p style={{ fontSize: '24px', textAlign: 'center' }}>Error: {error.message}</p>}

      {articles.map((article) => {
        return (
          <Post
            key={article.slug}
            title={article.title}
            body={article.description}
            userName={article.author.username}
            date={article.createdAt}
            slug={article.slug}
            tags={article.tagList}
            image={article.author.image}
            favoritesCount={article.favoritesCount}
          />
        );
      })}

      <PaginationBar pageNumbers={pageNumbers} handlePageClick={handlePageClick} currentPage={page} />
    </div>
  );
}
