import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

import Home from './pages/Home';
import MyPage from './pages/MyPage';
import New from './pages/New';
import Edit from './pages/Edit';
import Diary from './pages/Diary';
import Login from './pages/login/Login';
import Join from './pages/join/Join';
import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { AuthContext } from './context/AuthContext';
import { userInputs } from './pages/join/userInputs';
import Navigation from './components/Navigation';
import BackParticle from './components/background/BackParticle';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { type } from '@testing-library/user-event/dist/type';

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      newState = [action.data, ...state];
      break;
    }
    case 'REMOVE': {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case 'EDIT': {
      newState = state.map((it) =>
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App({ isLoggedIn, Cursor }) {
  const { currentUser } = useContext(AuthContext);
  let session = window.sessionStorage;

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to='/login' />;
  };

  // console.log(currentUser);

  const [data, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    const fetchDiaries = async () => {
      const diariesRef = collection(db, 'diaries'); // diaries 컬렉션 참조
      const q = query(diariesRef, orderBy('date', 'desc')); // 날짜 기준 내림차순 정렬
      const querySnapshot = await getDocs(q); // 쿼리 실행
      const diaryList = [];
      querySnapshot.forEach((doc) => {
        diaryList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      if (diaryList.length >= 1) {
        dataId.current = parseInt(diaryList[0].id) + 1;
        dispatch({ type: 'INIT', data: diaryList });
      }
    };
    fetchDiaries();
  }, []);

  const dataId = useRef(0);

  //CREATE
  const onCreate = async (date, content, files, icon, user_id) => {
    const newDiary = {
      id: dataId.current,
      date: new Date(date).getTime(),
      content,
      files,
      icon,
      user_id: user_id,
    };

    //Firestore에 저장
    await setDoc(doc(db, 'diaries', String(dataId.current)), newDiary);

    dispatch({
      type: 'CREATE',
      data: newDiary,
    });
    dataId.current += 1;
  };

  //REMOVE
  const onRemove = async (targetId) => {
    //Firestore에서 삭제
    await deleteDoc(doc(db, 'diaries', String(targetId)));
    dispatch({ type: 'REMOVE', targetId });
  };

  //EDIT
  const onEdit = async (targetId, date, content, files, icon, user_id) => {
    const updatedDiary = {
      id: targetId,
      date: new Date(date).getTime(),
      content,
      files,
      icon,
      user_id: user_id,
    };

    //Firestore에서 업데이트
    await setDoc(doc(db, 'diaries', String(targetId)), updatedDiary);

    dispatch({
      type: 'EDIT',
      data: updatedDiary,
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onEdit, onRemove }}>
        <BrowserRouter
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Navigation />

          <div className='App'>
            <div className='site'>
              <div className='circle circle1'></div>
              <div className='circle circle2'></div>
            </div>
            <Routes>
              <Route
                path='/mypage'
                element={
                  <RequireAuth>
                    <MyPage Cursor={Cursor} />
                  </RequireAuth>
                }
              />
              <Route
                path='/new/:theme/:id'
                element={
                  <RequireAuth>
                    <New Cursor={Cursor} />
                  </RequireAuth>
                }
              />
              <Route
                path='/edit/:id'
                element={
                  <RequireAuth>
                    <Edit Cursor={Cursor} />
                  </RequireAuth>
                }
              />
              <Route
                path='/diary/:id'
                element={
                  <RequireAuth>
                    <Diary Cursor={Cursor} />
                  </RequireAuth>
                }
              />

              <Route
                path='/join'
                element={<Join inputs={userInputs} title='Add New User' />}
              />

              <Route path='/login' element={<Login />} />
              <Route
                path='/'
                element={
                  <RequireAuth>
                    <Home Cursor={Cursor} />
                  </RequireAuth>
                }
              />
            </Routes>
          </div>
          <footer
            style={{
              textAlign: 'center',
              margin: '20px 0 50px 0',
              color: '#000',
            }}>
            Powered by HJ🚀
          </footer>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
