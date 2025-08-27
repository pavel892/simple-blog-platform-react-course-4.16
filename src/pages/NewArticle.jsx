import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import Tag from '../components/Tag/Tag';
import Loader from '../components/Loader';
import './NewArticle.css';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

export default function NewArticle() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [tagsLoading, setTagsLoading] = useState(true);
  const [tagsError, setTagsError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const tagsArray = useMemo(() => {
    return tags.map((tag) => ({
      id: uuid(),
      tag: tag,
    }));
  }, [tags]);

  const selectedTagsArray = tagsArray.filter((tag) => selectedTags.includes(tag.id));

  const newTags = selectedTagsArray.map((tag) => {
    return tag.tag;
  });

  function handleTagClick(id) {
    if (selectedTags.includes(id)) {
      setSelectedTags((prevSelectedTags) => {
        return prevSelectedTags.filter((tag) => {
          return tag !== id;
        });
      });
    } else {
      setSelectedTags((prevSelectedTags) => {
        return [...prevSelectedTags, id];
      });
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://realworld.habsida.net/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.mainContent,
            tagList: selectedTagsArray.length === 0 ? [null] : newTags,
          },
        }),
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
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch('https://realworld.habsida.net/api/tags');

        if (!res.ok) {
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const result = await res.json();
        setTags(result.tags);
      } catch (err) {
        setTagsError(err);
      } finally {
        setTagsLoading(false);
      }
    };

    fetchTags();
  }, []);
  return (
    <form className="new-article" onSubmit={handleSubmit(onSubmit)}>
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

      {tagsLoading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Loader />
        </div>
      )}

      {tagsError && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{tagsError}</p>}
      <div className="tags">
        {tagsArray.map((tag) => {
          return (
            <Tag
              name={tag.tag}
              key={tag.id}
              style={{ marginBottom: '8px' }}
              onClick={() => {
                handleTagClick(tag.id);
              }}
              className={selectedTags.includes(tag.id) && 'selected'}
            />
          );
        })}
      </div>
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
