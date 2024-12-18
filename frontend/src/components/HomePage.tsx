import HomePageInfoBox from './HomePageInfoBox';

import '../styles/HomePage.css';

const HomePage = () => {
  const weatherMapInfoText =
    'Need inspiration for choosing your next destination? Use Weather map and click anywhere around the world to check out the current weather and a webcam picture from your dream destination!';

  const todoInfoText =
    'Planning a trip can get complicated... Use Trip To Do to keep on track with all your necessary tasks before your vaction can begin!';
  return (
    <div className="home-page-container">
      <h1 className="home-page-header">Plan your next trip with Plan Your Trip!</h1>
      <div className="home-page-info-boxes-container">
        <HomePageInfoBox
          heading="Weather map"
          image="../src/images/weatherMapPreview.png"
          infotext={weatherMapInfoText}
          link="/weathermap"
        />
        <HomePageInfoBox
          heading="Trip To Do"
          image="../src/images/todoPreview.png"
          infotext={todoInfoText}
          link="/todo"
        />
      </div>
    </div>
  );
};

export default HomePage;