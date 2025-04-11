import { useContext, useEffect, useRef, useState } from 'react';
import { DiaryStateContext } from '../App';
import './../App.css';

//COMPONENTS
import MyButton from './../components/MyButton';
import MyHeader from './../components/MyHeader';
import DiaryList from './../components/DiaryList';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import noProfile from './../pages/images/profileUndefined.png';

const MyPage = ({ Cursor }) => {
  const diaryList = useContext(DiaryStateContext);

  const [data, setData] = useState([]);
  const [curDate, setCurDate] = useState(new Date());
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;
  //const [userProfile, setUserProfile] = useState();
  const [files, setFiles] = useState();
  const [userName, setUserName] = useState();

  const session = window.sessionStorage;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const docRef = doc(db, 'users', session.getItem('user_id'));
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFiles(userData.img || noProfile);
          setUserName(userData.displayName);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        setFiles(noProfile);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (diaryList.length >= 1) {
      const firstDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime();

      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

      setData(
        diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay)
      );
    }
  }, [diaryList, curDate]);

  const increaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate())
    );
  };

  const decreaseMonth = () => {
    setCurDate(
      new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate())
    );
  };

  return (
    <div className='contents'>
      <Cursor />

      <div>
        <MyHeader
          headText={headText}
          leftChild={<MyButton text={'<'} onClick={decreaseMonth} />}
          rightChild={<MyButton text={'>'} onClick={increaseMonth} />}
        />
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <img src={files} className='userProfile' />
          </div>
          <div style={{ display: 'flex', padding: '10px 0 0 10px' }}>
            <div>
              <span
                style={{
                  fontFamily: 'SCDream4',
                  fontSize: '16px',
                  color: '#084298',
                }}>
                {userName}📍
              </span>{' '}
              <h2>나의 일기장</h2>
            </div>
          </div>
        </div>

        <DiaryList diaryList={data} />
      </div>
    </div>
  );
};

export default MyPage;
