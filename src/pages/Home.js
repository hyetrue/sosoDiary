import './../App.css';
import think from './images/img01_think.png';
import work from './images/img02_work.png';
import study from './images/img03_study.png';
import create from './images/img04_create.png';
import message from './images/img05_message.png';
import { DiaryStateContext } from '../App';
import { CiSquareChevRight } from 'react-icons/ci';
import BackParticle from '../components/background/BackParticle';

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import LatestItem from '../components/LatestItem';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Diary from './Diary';

const Home = ({ Cursor }) => {
  const latestList = useContext(DiaryStateContext);

  const [userName, setUserName] = useState('');
  const [data, setData] = useState([]);
  const [curDate, setCurDate] = useState(new Date());

  const session = window.sessionStorage;

  const userinfo = (async () => {
    const docRef = doc(db, 'users', session.getItem('user_id'));
    const docSnap = await getDoc(docRef);
    setUserName(docSnap.data().displayName);
  })();

  useEffect(() => {
    const titleElement = document.getElementsByTagName('title')[0];
    titleElement.innerHTML = `소소일기`;
  });

  useEffect(() => {
    if (latestList.length >= 1) {
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
        latestList.filter((it) => firstDay <= it.date && it.date <= lastDay)
      );
    }
  }, [latestList, curDate]);

  //최근 데이터 3개만 필터링
  const getLatestDiaries = () => {
    if (!latestList || latestList.length === 0) return [];

    return latestList
      .filter((it) => it.user_id === session.getItem('user_id'))
      .sort((a, b) => parseInt(b.date) - parseInt(a.date))
      .slice(0, 3);
  };

  return (
    <div className='main_container'>
      <Cursor />
      <BackParticle />
      <div className='top_title'>
        <span
          style={{
            color: '#eaa60d',
            fontWeight: 'bold',
            background: 'aliceblue',
          }}>
          {userName}
        </span>{' '}
        님의 소소했던 오늘 하루를 기록해 보세요.
      </div>

      {/* 최근 데이터 슬라이더 추가 */}
      <div className='latest-diary-section'>
        <h3>최근 일기</h3>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}>
          {getLatestDiaries().map((diary) => (
            <SwiperSlide key={diary.id}>
              <LatestItem {...diary} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div id='motion-box'></div>
      <div className='img_btn'>
        <Link to='/new/think/1'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            drag='x'
            dragConstraints={{ left: -100, right: 100 }}>
            <img className='image' alt='Think' src={think} />
          </motion.div>
        </Link>
        <Link to='/new/work/2'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            drag='x'
            dragConstraints={{ left: -100, right: 100 }}>
            <img className='image' alt='Work' src={work} />
          </motion.div>
        </Link>
        <Link to='/new/study/3'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            drag='x'
            dragConstraints={{ left: -100, right: 100 }}>
            <img className='image' alt='Study' src={study} />
          </motion.div>
        </Link>

        <Link to='/new/create/4'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            drag='x'
            dragConstraints={{ left: -100, right: 100 }}>
            <img className='image' alt='Create' src={create} />
          </motion.div>
        </Link>

        <Link to='/new/message/5'>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            drag='x'
            dragConstraints={{ left: -100, right: 100 }}>
            <img className='image' alt='Message' src={message} />
          </motion.div>
        </Link>
      </div>

      <div
        style={{ fontSize: '36px', textAlign: 'center', marginBottom: '60px' }}>
        <div className='man'>
          <div className='head'></div>
          <div className='body'></div>
          <div className='feet'>
            <div className='foot'></div>
            <div className='foot'></div>
          </div>
        </div>{' '}
        --- ⚠️작업중입니다👷 ---{' '}
      </div>

      <div className='top_title'>
        최근 일기 LIST -- 준비중{' '}
        <Link to='/mypage'>
          <CiSquareChevRight />
        </Link>
      </div>
      <div className='recent-list'>
        <LatestItem latestList={data} />
      </div>
    </div>
  );
};

export default Home;
