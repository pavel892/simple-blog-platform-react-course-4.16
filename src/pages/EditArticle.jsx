import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import './EditArticle.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';

export default function EditArticle() {
  const article = useLoaderData();
  const slug = article.article.slug;
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://realworld.habsida.net/api/articles/' + slug, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.mainContent,
          },
        }),
      });

      const result = await res.json();

      if (res.status === 401) {
        throw new Error('Error: Unauthorized');
      }

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      navigate(`/articles/${result.article.slug}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="edit-article" onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        id="title"
        placeholder="Title"
        register={register('title', {
          required: 'This field is required',
        })}
      />
      {errors.title && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.title.message}</p>}

      <Input
        type="text"
        id="description"
        placeholder="Short description"
        register={register('description', {
          required: 'This field is required',
        })}
      />
      {errors.description && (
        <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.description.message}</p>
      )}

      <textarea
        {...register('mainContent', {
          required: 'This field is required',
        })}
        placeholder="Input your text"
      ></textarea>
      {errors.mainContent && (
        <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.mainContent.message}</p>
      )}

      {error && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{error}</p>}

      <Button
        text="Publish Article"
        type="submit"
        style={{
          width: '133px',
          height: '43px',
          backgroundColor: '#61BB61',
          color: '#ffffff',
          fontSize: '18px',
          marginTop: '16px',
          marginLeft: '360px',
        }}
      />
    </form>
  );
}
