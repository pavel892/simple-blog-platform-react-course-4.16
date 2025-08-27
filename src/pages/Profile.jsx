import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useForm } from 'react-hook-form';
import { useAuth } from '../useAuth';
import profilePicture from '../../public/profile.png';
import './Profile.css';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = useAuth();
  const navigate = useNavigate();
  const profile = useLoaderData();
  const userName = profile.profile.username;
  const token = localStorage.getItem('token');

  const [error, setError] = useState(null);
  const [followed, setFollowed] = useState(false);

  async function followUser() {
    setFollowed(true);
    try {
      const res = await fetch(`https://realworld.habsida.net/api/profiles/${userName}/follow`, {
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

  async function unfollowUser() {
    setFollowed(false);
    try {
      const res = await fetch(`https://realworld.habsida.net/api/profiles/${userName}/follow`, {
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
    if (!followed) {
      followUser();
    } else {
      unfollowUser();
    }
  }

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://realworld.habsida.net/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          bio: data.bio,
          email: data.email,
          image: data.avatarImg === '' ? null : data.avatarImg,
          username: data.username,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      auth.updateProfile(data.email, token, data.username, data.avatarImg, data.bio);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  return (
    <>
      <div className="profile-banner">
        <img src={profile.profile.image === null ? profilePicture : profile.profile.image} alt="profile" />
        <p style={{ fontSize: '32px', color: '#ffffff', marginTop: '10px' }}>{profile.profile.username}</p>

        <p style={{ color: '#ffffff' }}>{profile.profile.bio}</p>

        {profile.profile.username !== auth.userName && (
          <Button
            onClick={handleClick}
            text={followed ? 'Unfollow' : 'Follow'}
            icon={true}
            style={{
              width: '120px',
              height: '44px',
              fontSize: '18px',
              margin: '20.5px auto 0 auto',
              backgroundColor: '#333333',
            }}
          />
        )}
      </div>
      {profile.profile.username === auth.userName && (
        <form className="profile" onSubmit={handleSubmit(onSubmit)}>
          <h2>Your Settings</h2>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            register={register('username', {
              required: 'This field is required',
              minLength: {
                value: 3,
                message: 'Minimum 3 characters required',
              },
              maxLength: {
                value: 20,
                message: 'Maximum 20 characters allowed',
              },
            })}
          />
          {errors.username && (
            <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.username.message}</p>
          )}

          <Input
            type="email"
            id="email"
            placeholder="Email address"
            register={register('email', {
              required: 'This field is required',
            })}
          />

          {errors.email && (
            <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.email.message}</p>
          )}
          <textarea {...register('bio')} placeholder="Input your comment"></textarea>
          <Input
            type="text"
            id="avatar-img"
            placeholder="Avatar image (URL)"
            register={register('avatarImg', {
              pattern: {
                value: /^(ftp|http|https):\/\/[^ "]+$/,
                message: 'Invalid URL',
              },
            })}
          />

          {errors.avatarImg && (
            <p style={{ marginTop: '5px', color: 'red', marginRight: '340px' }}>{errors.avatarImg.message}</p>
          )}

          {error && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{error}</p>}

          <Button
            text="Update Settings"
            type="submit"
            style={{
              width: '144px',
              height: '43px',
              backgroundColor: '#61BB61',
              color: '#ffffff',
              fontSize: '18px',
              marginTop: '16px',
              marginLeft: '336px',
            }}
          />

          <Button
            onClick={handleLogout}
            text="Or click here to logout"
            style={{
              width: '150px',
              height: '32px',
              backgroundColor: '#ffffff',
              color: '#BB6161',
              fontSize: '12.8px',
              marginTop: '16px',
              border: '1px solid #BB6161',
              marginRight: '330px',
            }}
          />
        </form>
      )}
    </>
  );
}
