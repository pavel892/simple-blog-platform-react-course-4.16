import './Sidebar.css';
import Tag from '../Tag/Tag';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-container">
        <p>Popular tags</p>
        <div style={{ marginTop: '12px' }}>
          <Tag name="one" />
          <Tag name="something" />
          <Tag name="chinese" />
          <Tag name="english" />
          <Tag name="french" />
        </div>
      </div>
    </div>
  );
}
