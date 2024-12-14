import '../styles/WebcamPicture.css';

interface Props {
  url: string | null;
}

const WebcamPicture = ({ url }: Props) => {
  if (!url) {
    return null;
  }

  return (
    <div className="webcam-pic-container">
      <img className="webcam-pic" src={url} alt="Webcam from defined location" />
    </div>
  );
};

export default WebcamPicture;
