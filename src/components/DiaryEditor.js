import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MyHeader from './MyHeader';
import MyButton from './MyButton';

import IconItem from './IconItem';
import { DiaryDispatchContext } from '../App';
import { getStringDate } from '../util/date';
import { iconList } from '../util/icon';

/* Firebase - imageUpload */
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid'; // 랜덤 식별자를 생성해주는 라이브러리
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { clear } from '@testing-library/user-event/dist/clear';

const DiaryEditor = ({ isEdit, originData }) => {
  const [data, setData] = useState();
  const contentRef = useRef();
  const [content, setContent] = useState('');
  const [per, setPerc] = useState(null);

  //닉네임
  const session = window.sessionStorage;
  const [userName, setUserName] = useState();

  const fnc = (async () => {
    const docRef = doc(db, 'users', session.getItem('user_id'));
    const docSnap = await getDoc(docRef);
    setUserName(docSnap.data().displayName);
  })();

  // 파일 저장 배열
  const [files, setFiles] = useState([]);

  const { id } = useParams();

  const [icon, setIcon] = useState(parseInt(id));
  const [date, setDate] = useState(getStringDate(new Date()));

  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
  const handleClickIcon = useCallback((icon) => {
    setIcon(icon);
  }, []);
  // console.log(icon);

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (content.length < 1) {
      contentRef.current.focus();
      return;
    }

    if (
      window.confirm(
        isEdit ? '일기를 수정하시겠습니까?' : '새로운 일기를 작성하시겠습니까?'
      )
    ) {
      if (!isEdit) {
        onCreate(
          date,
          content,
          files,
          icon,
          window.sessionStorage.getItem('user_id')
        );
      } else {
        onEdit(
          originData.id,
          date,
          content,
          files,
          icon,
          window.sessionStorage.getItem('user_id')
        );
      }
    }

    navigate('/mypage', { replace: true });
  };

  const handleRemove = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      onRemove(originData.id);
      navigate('/mypage', { replace: true });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setIcon(originData.icon);
      setContent(originData.content);
      setFiles(originData.files);
      window.sessionStorage.getItem('user_id');
    }
  }, [isEdit, originData]);

  const storage = getStorage();
  const [attachment, setAttachment] = useState([]);

  // 파일 등록
  const onFileChange = (e) => {
    // 업로드 된 file
    const files = e.target.files;
    const theFile = files[0];

    // FileReader 생성
    const reader = new FileReader();

    // file 업로드가 완료되면 실행
    reader.onloadend = (finishedEvent) => {
      // 업로드한 이미지 URL 저장
      const result = finishedEvent.currentTarget.result;
      setAttachment(result);
    };
    // 파일 정보를 읽기
    reader.readAsDataURL(theFile);
  };

  //선택된 파일 삭제
  const onClearAttachment = () => setAttachment(null);

  //파일 전송
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!attachment) {
      alert('파일을 선택해주세요.');
      return;
    }

    try {
      const storage = getStorage();
      //사용자 ID와 타임스탬프를 파일명에 포함시켜 고유성 보장
      const fileName = `${session.getItem(
        'user_id'
      )}_${Date.now()}_${uuidv4()}`;
      const fileRef = ref(storage, `diary_images/${fileName}`);

      //첫 번째 업로드
      const response = await uploadString(fileRef, attachment, 'data_url');
      console.log('파일 업로드 성공', response);

      //파일 URL 가져오기
      const fileURL = await getDownloadURL(fileRef);
      setFiles([...files, fileURL]);
      alert('등록완료!');
      setAttachment(null);
    } catch (error) {
      console.log('업로드 파일 오류:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  // 등록된 파일 삭제
  const onDelete = () => {
    const desertRef = ref(storage, files[0]);
    //Delete the file
    deleteObject(desertRef)
      .then(() => {
        files.length = 0;
        alert('삭제완료');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='contents'>
      <MyHeader
        headText={isEdit ? '일기 수정' : `${userName}의 오늘 일기`}
        leftChild={<MyButton text={'<'} onClick={() => navigate(-1)} />}
        rightChild={
          isEdit && (
            <MyButton text={'삭제'} type={'negative'} onClick={handleRemove} />
          )
        }
      />
      <div className='DiaryEditor'>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className='input_box'>
            <input
              className='input_date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type='date'
            />
          </div>
        </section>
        <section>
          <h4>오늘의 이야기는</h4>
          <div className='input_box icon_list_wrapper'>
            {iconList.map((it) => (
              <IconItem
                key={it.icon_id}
                {...it}
                onClick={handleClickIcon}
                isSelected={it.icon_id === icon}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘은</h4>
          <div className='input_box text_wrapper'>
            <textarea
              placeholder='오늘은 어땠나요?'
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <h4>나의 그림</h4>
          <form onSubmit={onSubmit}>
            <input
              type='file'
              accept='images/*'
              onChange={onFileChange}
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#666',
                border: '1px solid #000',
                borderRadius: '3px',
                marginBottom: '30px',
              }}
            />
            {attachment && (
              <div
                style={{
                  display: 'contents',
                  marginRight: '10px',
                }}>
                <button
                  onClick={onClearAttachment}
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: '#f4f1cf',
                    marginRight: '5px',
                  }}>
                  삭제
                </button>
                <input
                  type='submit'
                  value='등록'
                  style={{
                    fontSize: '20px',
                    background: '#111',
                    color: '#fff',
                    marginBottom: '30px',
                  }}
                  onChange={(e) => setFiles(e.target.files)}
                />
                <h5 style={{ fontWeight: 'bold' }}>❗파일을 등록해주세요.</h5>
                <br />
                <img
                  src={attachment}
                  width='50%'
                  alt=''
                  disabled={per != null && per < 100}
                  className='attachment'
                />
              </div>
            )}
          </form>
          {/* <div>파일명 : </div> */}
          <button onClick={onDelete}>등록된 이미지 삭제</button>
        </section>

        <section>
          <div className='control_box'>
            <MyButton
              text={'취소'}
              type={'negative'}
              onClick={() => navigate(-1)}
            />
            <MyButton
              text={'작성완료'}
              type={'positive'}
              onClick={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiaryEditor;
