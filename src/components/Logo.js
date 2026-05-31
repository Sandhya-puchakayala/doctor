import './Logo.css';

const Logo = ({ visible }) => {
  return (
    <div className={`logo ${visible ? 'logo--visible' : ''}`}>
      <img
        src={process.env.PUBLIC_URL + '/N4Y_logo.png'}
        alt="N4Y – Nonjudgmental 4 You"
        className="logo__img"
      />
    </div>
  );
};

export default Logo;
