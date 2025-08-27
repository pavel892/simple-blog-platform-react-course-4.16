import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import { useForm } from 'react-hook-form';
import './SignUp.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [error, setError] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (auth.user) {
      navigate('/');
    }
  }, [auth.user, navigate]);

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const res = await fetch('https://realworld.habsida.net/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username: data.username,
            email: data.email,
            password: data.password,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
      const token = result.user.token;
      localStorage.setItem('token', token);

      auth.login(data.email, token, result.user.username, result.user.image, result.user.bio);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form className="sign-up" onSubmit={handleSubmit(onSubmit)}>
        <h2>Sign Up</h2>
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

        {errors.email && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.email.message}</p>}
        <Input
          type="password"
          id="password"
          placeholder="Password"
          register={register('password', {
            required: 'This field is required',
            minLength: {
              value: 6,
              message: 'Minimum 6 characters required',
            },
            maxLength: {
              value: 40,
              message: 'Maximum 40 characters allowed',
            },
          })}
        />
        {errors.password && (
          <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.password.message}</p>
        )}
        <Input
          type="password"
          id="repeatPassword"
          placeholder="Repeat Password"
          register={register('repeatPassword', {
            required: 'This field is required',
            validate: (val) => val === password || 'Passwords do not match',
          })}
        />

        {errors.repeatPassword && (
          <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.repeatPassword.message}</p>
        )}

        <div className="checkbox">
          <input
            type="checkbox"
            id="terms"
            {...register('terms', {
              required: 'This field is required',
            })}
          />
          <label htmlFor="terms">I agree to terms and conditions and privacy policy</label>
        </div>
        {errors.terms && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{errors.terms.message}</p>}

        {error && <p style={{ marginTop: '5px', color: 'red', marginRight: '285px' }}>{error}</p>}

        <Button
          text="Sign Up"
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
