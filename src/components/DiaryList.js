import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiaryItem from './DiaryItem';
import MyButton from './MyButton';

const sortOptionList = [
  { value: 'latest', name: '최신순' },
  { value: 'oldest', name: '오래된 순' },
];

const ThemeOptionList = [
  { value: 'all', name: '모든 일기' },
  { value: 'think', name: 'Think' },
  { value: 'work', name: 'Work' },
  { value: 'study', name: 'Study' },
  { value: 'create', name: 'Create' },
  { value: 'message', name: 'Message' },
];

const ControlMenu = React.memo(({ value, onChange, optionList }) => {
  useEffect(() => {
    console.log('Control Menu');
  });
  return (
    <select
      className='ControlMenu'
      value={value}
      onChange={(e) => onChange(e.target.value)}>
      {optionList.map((it, idx) => (
        <option key={idx} value={it.value}>
          {it.name}
        </option>
      ))}
    </select>
  );
});

const DiaryList = ({ diaryList = [] }) => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState('latest');
  const [filter, setFilter] = useState('all');

  let session = window.sessionStorage;
  let user_id = session.getItem('user_id');

  const getProcessedDiaryList = () => {
    const filterCallBack = (item) => {
      if (filter === 'think') {
        return parseInt(item.icon) === 1;
      }
      if (filter === 'work') {
        return parseInt(item.icon) === 2;
      }
      if (filter === 'study') {
        return parseInt(item.icon) === 3;
      }
      if (filter === 'create') {
        return parseInt(item.icon) === 4;
      }
      if (filter === 'message') {
        return parseInt(item.icon) === 5;
      }
      return filter === 'all';
    };

    const compare = (a, b) => {
      if (sortType === 'latest') {
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    const copyList = JSON.parse(JSON.stringify(diaryList));

    // 로그인한 사용자의 일기만 필터링
    const userFilteredList = copyList.filter(
      (item) => item.user_id === user_id
    );

    // 테마 필터링
    const filteredList =
      filter === 'all'
        ? userFilteredList
        : userFilteredList.filter((it) => filterCallBack(it));

    // 정렬 (기본값을 latest로 설정)
    const sortedList = filteredList.sort(compare);
    return sortedList;
  };

  return (
    <div className='DiaryList'>
      <div className='menu_wrapper'>
        <div className='left_col'>
          <ControlMenu
            value={sortType}
            onChange={setSortType}
            optionList={sortOptionList}
          />

          <ControlMenu
            value={filter}
            onChange={setFilter}
            optionList={ThemeOptionList}
          />
        </div>
        <div className='right_col'>
          <MyButton
            type={'positive'}
            text={'일기쓰기'}
            onClick={() => navigate('/new/write/3')}
          />
        </div>
      </div>

      {getProcessedDiaryList().map((it) => (
        <DiaryItem key={`${it.id}-${it.user_id}`} {...it} />
      ))}
    </div>
  );
};

export default DiaryList;
