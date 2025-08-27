import './Tag.css';

export default function Tag({ name, style, onClick = () => {}, className = null }) {
  return (
    <span className={`tag ${className && className}`} style={style} onClick={onClick}>
      {name}
    </span>
  );
}
