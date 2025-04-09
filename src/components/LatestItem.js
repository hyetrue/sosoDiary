import { useNavigate } from 'react-router-dom';
import ing from './../pages/images/ing.png';

const LatestItem = ({ latestList }) => {
  const navigate = useNavigate();

  if (!latestList || latestList.length === 0) {
    return null;
  }

  // 가장 최근 일기 하나만 선택
  const latestDiary = latestList[0];
  const strDate = new Date(parseInt(latestDiary.date)).toLocaleDateString();

  const goDetail = () => {
    navigate(`/diary/${latestDiary.id}`);
  };

  // files 데이터 처리
  const getImageUrl = () => {
    if (!latestDiary.files || latestDiary.files.length === 0) {
      return ing;
    }

    // files 배열의 첫 번째 항목 사용
    const firstFile = latestDiary.files[0];

    // 파일이 문자열 URL인 경우
    if (typeof firstFile === 'string') {
      return firstFile;
    }

    // 파일이 File 객체인 경우
    if (firstFile instanceof File) {
      return URL.createObjectURL(firstFile);
    }

    // 그 외의 경우 기본 이미지 사용
    return ing;
  };

  return (
    <div className='recent-box'>
      <div className='list_item' onClick={goDetail}>
        <img className='list_img' src={getImageUrl()} alt='일기 이미지' />
      </div>
      {/* <div className='list_text'>{strDate}</div> */}
    </div>
  );
};

export default LatestItem;
