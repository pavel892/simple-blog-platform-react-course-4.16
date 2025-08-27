import './Banner.css';

export default function Banner({ mainContent, additionalContent, style, mainTextStyle, userInfo }) {
  return (
    <div style={style}>
      <div>
        {mainContent && (
          <p className="mainText" style={mainTextStyle}>
            {mainContent}
          </p>
        )}
        {userInfo && userInfo}
        {additionalContent && <p className="additionalText">{additionalContent}</p>}
      </div>
    </div>
  );
}
