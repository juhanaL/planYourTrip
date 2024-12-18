import { Link } from 'react-router-dom';

import '../styles/HomePageInfoBox.css';

interface Props {
  heading: string;
  image: string;
  infotext: string;
  link: string;
}

const HomePageInfoBox = ({ heading, image, infotext, link }: Props) => {
  return (
    <div className="home-page-info-container">
      <Link to={link} className="nav-link">
        <h2 className="home-page-info-heading">{heading}</h2>
        <p className="home-page-info-text">{infotext}</p>
        <div className="home-page-info-image-container">
          <img
            className="home-page-info-preview"
            alt={`Preview of ${heading} functionality`}
            src={image}
          />
        </div>
      </Link>
    </div>
  );
};

export default HomePageInfoBox;
