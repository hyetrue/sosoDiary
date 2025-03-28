import { doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiaryStateContext } from '../App';
import MyButton from '../components/MyButton';
import MyHeader from '../components/MyHeader';
import { db } from '../firebase';
import { getStringDate } from '../util/date';
import { iconList } from '../util/icon';

const Diary = () => {
  const { id } = useParams();
  const diaryList = useContext(DiaryStateContext);
  const navigate = useNavigate();
  const [data, setData] = useState();
  const [files, setFiles] = useState('');
  //닉네임
  const session = window.sessionStorage;
  const [userName, setUserName] = useState();

  const userinfo = (async () => {
    const docRef = doc(db, 'users', session.getItem('user_id'));
    const docSnap = await getDoc(docRef);

    setUserName(docSnap.data().displayName);
  })();

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = `소소일기 - ${id}번째 일기장`;
  });

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );

      if (targetDiary) {
        //일기가 존재할 때
        setData(targetDiary);
      } else {
        //일기가 없을 때
        alert('없는 일기입니다.');
        navigate('/mypage', { replace: true });
      }
    }
  }, [id, diaryList]);

  if (!data) {
    return <div className='DiaryPage'>로딩중입니다...</div>;
  } else {
    const CurIconData = iconList.find(
      (it) => parseInt(it.icon_id) === parseInt(data.icon)
    );
    // console.log(CurIconData);

    return (
      <div className='content_detail'>
        <div className='DiaryPage'>
          <MyHeader
            headText={`${getStringDate(new Date(data.date))} 일기`}
            leftChild={<MyButton text={'<'} onClick={() => navigate(-1)} />}
            rightChild={
              <MyButton
                text={'수정'}
                onClick={() => navigate(`/edit/${data.id}`)}
              />
            }
          />
          <article>
            <section>
              <h4>✨오늘의 소소한 이야기✨</h4>
              <div className='diary_img_wrapper'>
                <img src={CurIconData.icon_img} />
                <div className='icon_descript'>{CurIconData.icon_descript}</div>
              </div>
            </section>
            <section>
              <h4>오늘의 일기📖</h4>
              <div className='diary_content_wrapper'>
                <p>{data.content}</p>
              </div>
              <h4 style={{ marginTop: '80px' }}> 🖍️{userName}의 그림 </h4>
              <div className='diary_file_wrapper'>
                <div className='art_item'>
                  <img src={data.files[0]} className='art_img' />
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
    );
  }
};

export default Diary;
