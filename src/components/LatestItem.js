import { useNavigate } from 'react-router-dom';
import ing from './../pages/images/ing.png';

const LatestItem = ({ id, files, date }) => {
  const navigate = useNavigate();

  const srtDate = new Date(parseInt(date)).toLocaleDateString();

  const goDetail = () => {
    navigate(`/diary/${id}`);
  };

  return (
    <div className='recent-box'>
      <div className='list_item' onClick={goDetail}>
        <img className='list_img' src={ing} />
        {/* <img
          className="list_img"
          src={files ? URL.createObjectURL(files) : "null"}
        /> */}
      </div>
      <div className='list_text'>{srtDate}</div>
    </div>
  );
};

export default LatestItem;
