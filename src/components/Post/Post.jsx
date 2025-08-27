import './Post.css';
import Tag from '../Tag/Tag';
import UserInfo from '../UserInfo/UserInfo';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Post({ title, body, userName, date, slug, tags, image, favoritesCount }) {
  const [favoritesNumber, setFavoritesNumber] = useState(favoritesCount);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
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

      const result = await res.json();
      setFavoritesNumber(result.article.favoritesCount);
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

      const result = await res.json();
      setFavoritesNumber(result.article.favoritesCount);
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
  return (
    <div className="post">
      {error && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{error}</p>}
      <div className="post-container">
        <div className="user-info-container">
          <UserInfo userName={userName} date={date} image={image} />
          <Button
            onClick={handleClick}
            icon={true}
            text={favoritesNumber}
            style={{
              width: '77px',
              height: '40px',
              fontSize: '12.8px',
              backgroundColor: '#ffffff',
              color: '#61BB61',
            }}
          />
        </div>
        <Link className="post-title" to={`/articles/${slug}`}>
          {title}
        </Link>
        <p className="post-text">{body}</p>
        {!tags.includes(null) &&
          tags.map((tag, i) => {
            return <Tag key={i} name={tag} style={{ marginBottom: '8px' }} />;
          })}
      </div>
    </div>
  );
}
