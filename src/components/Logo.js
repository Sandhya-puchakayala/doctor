import './Logo.css';

const Logo = ({ visible }) => {
  return (
    <div className={`logo ${visible ? 'logo--visible' : ''}`}>
      <img
        src="https://res.cloudinary.com/dawgv7mq0/image/upload/v1779906112/doctor_new_image_new_logo_pjxnmx.png"
        alt="N4Y – Nonjudgmental 4 You"
        className="logo__img"
      />
    </div>
  );
};

export default Logo;
