import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import Loader from '../components/Loader';
import { useForm } from 'react-hook-form';
import { useAuth } from '../useAuth';
import './SignIn.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      navigate('/');
    }
  }, [auth.user, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch('https://realworld.habsida.net/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: data.email,
            password: data.password,
          },
        }),
      });

      const result = await res.json();
      if (res.status === 401) {
        throw new Error('Invalid password');
      }
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const token = result.user.token;
      localStorage.setItem('token', token);

      auth.login(data.email, token, result.user.username, result.user.image, result.user.bio);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form className="sign-in" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign In</h2>
        {isLoading && <Loader />}
        <Input
          type="email"
          id="email"
          placeholder="Email Address"
          register={register('email', { required: 'This field is required' })}
        />
        {errors.email && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.email.message}</p>}

        <Input
          type="password"
          id="password"
          placeholder="Password"
          register={register('password', {
            required: 'This field is required',
          })}
        />
        {errors.password && (
          <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.password.message}</p>
        )}

        {error && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{error}</p>}

        <Button
          text="Sign In"
          type="submit"
          style={{
            width: '120px',
            height: '43px',
            backgroundColor: '#61BB61',
            color: '#ffffff',
            fontSize: '18px',
            marginTop: '16px',
            marginLeft: '360px',
          }}
        />
      </form>
    </div>
  );
}
