import './Input.css';

export default function Input({ type, id, placeholder, register }) {
  return <input className="input" autoComplete="off" type={type} id={id} placeholder={placeholder} {...register} />;
}
