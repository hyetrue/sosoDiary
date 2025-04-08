import { useNavigate } from 'react-router-dom';
import React from 'react';
import ing from './../pages/images/ing.png';

const LatestItem = ({ id, files, date, content }) => {
  const navigate = useNavigate();

  const srtDate = new Date(parseInt(date)).toLocaleDateString();

  const goDetail = () => {
    navigate(`/diary/${id}`);
  };

  return (
    <div className='recent-box'>
      <div className='list_item' onClick={goDetail}>
        <img
          className='list_img'
          src={
            files && files[0]
              ? files[0]
              : process.env.PUBLIC_URL + '/assets/default-diary.png'
          }
          alt='데이터 이미지'
        />
      </div>
      <div className='latest-info'>
        <div className='latest-date'>{srtDate}</div>
        <div className='latest-content'>
          {content && content.slice(0, 30)}...
        </div>
      </div>
    </div>
  );
};

export default React.memo(LatestItem);
