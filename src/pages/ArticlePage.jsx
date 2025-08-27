import { useLoaderData, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Banner from '../components/Banner/Banner';
import UserInfo from '../components/UserInfo/UserInfo';
import Tag from '../components/Tag/Tag';
import Button from '../components/Button/Button';
import Loader from '../components/Loader';
import { useAuth } from '../useAuth';
import './ArticlePage.css';
import { useEffect, useState } from 'react';

export default function ArticlePage() {
  const article = useLoaderData();
  const slug = article.article.slug;
  const auth = useAuth();
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem('token');

  async function favoriteArticle() {
    setIsFavorite(true);
    try {
      const res = await fetch(`https://realworld.habsida.net/api/articles/${slug}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function unFavoriteArticle() {
    setIsFavorite(false);
    try {
      const res = await fetch(`https://realworld.habsida.net/api/articles/${slug}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function handleClick() {
    if (!isFavorite) {
      favoriteArticle();
    } else {
      unFavoriteArticle();
    }
  }

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modal]);

  function handleEditBtnClick() {
    navigate(`/articles/${article.article.slug}/edit`);
  }

  function handleDeleteBtnClick() {
    setModal(true);
  }

  function handleCancelClick() {
    setModal(false);
  }

  async function handleDeleteClick() {
    setIsLoading(true);
    setModal(false);
    try {
      const res = await fetch('https://realworld.habsida.net/api/articles/' + slug, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error('Error: Unauthorized');
      }

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="article-page">
      <Banner
        mainContent={article.article.title}
        mainTextStyle={{
          fontSize: '46px',
          marginBottom: '10px',
        }}
        style={{
          backgroundColor: '#333333',
          height: '282px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '118px',
        }}
        userInfo={
          <UserInfo
            userName={article.article.author.username}
            date={article.article.createdAt}
            image={article.article.author.image}
          />
        }
      />

      {isLoading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Loader />
        </div>
      )}
      <div className="article-body">
        <ReactMarkdown>{article.article.body}</ReactMarkdown>
        <div
          style={{
            marginTop: '24px',
          }}
        >
          {article.article.tagList.map((tag, i) => {
            return <Tag key={i} name={tag} style={{ marginBottom: '8px' }} />;
          })}
        </div>

        {error && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{error}</p>}

        {token && auth.userName === article.article.author.username && (
          <div className="edit-delete-btns">
            <Button
              onClick={handleEditBtnClick}
              text="Edit Article"
              style={{
                width: '133px',
                height: '43px',
                backgroundColor: '#61BB61',
                color: '#ffffff',
                fontSize: '18px',
              }}
            />
            <Button
              onClick={handleDeleteBtnClick}
              text="Delete Article"
              style={{
                width: '133px',
                height: '43px',
                backgroundColor: '#BB6161',
                border: '1px solid #BB6161',
                color: '#ffffff',
                fontSize: '18px',
              }}
            />
          </div>
        )}

        <div className="user-info-btn">
          <div style={{ marginRight: '16px' }}>
            <UserInfo
              userName={article.article.author.username}
              date={article.article.createdAt}
              image={article.article.author.image}
            />
          </div>

          <Button
            onClick={handleClick}
            text={isFavorite ? 'Unfavorite article' : 'Favorite article'}
            style={{
              width: '112px',
              height: '32px',
              fontSize: '12.8px',
              backgroundColor: '#61BB61',
              color: '#ffffff',
            }}
          />
        </div>
      </div>
      {modal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this article?</h2>
            <div>
              <Button
                onClick={handleCancelClick}
                text="Cancel"
                style={{
                  width: '120px',
                  height: '43px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #61BB61',
                  color: '#61BB61',
                  fontSize: '18px',
                }}
              />
              <Button
                onClick={handleDeleteClick}
                text="Delete"
                style={{
                  width: '120px',
                  height: '43px',
                  backgroundColor: '#BB6161',
                  border: '1px solid #BB6161',
                  color: '#ffffff',
                  fontSize: '18px',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
