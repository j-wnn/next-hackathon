import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import html2canvas from 'html2canvas';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collectionGroup,
  serverTimestamp,
} from 'firebase/firestore';

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDHQdKh0KTYXKtGfapCB7Ztmf1WL3vY2kA",
    authDomain: "ipsilenti-worldcup.firebaseapp.com",
    projectId: "ipsilenti-worldcup",
    storageBucket: "ipsilenti-worldcup.firebasestorage.app",
    messagingSenderId: "580015752446",
    appId: "1:580015752446:web:77fe98cbacd4fe68c391af",
    measurementId: "G-NR9H8T2D2K"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 2단 레이아웃
const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  min-height: 100vh;
  background: #f5f5f5;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    width: 100vw;
  }
`;

const LeftPanel = styled.div`
  flex: 2 1 0;
  max-width: 855px;
  min-width: 340px;
  background: #fff;
  margin: 2rem 1rem 2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem 2.5rem 2rem;
  @media (max-width: 900px) {
    margin: 1rem 0;
    width: 98vw;
    max-width: 98vw;
    padding: 1.5rem 0.5rem;
  }
`;

const RightPanel = styled.div`
  flex: 1 1 0;
  max-width: 600px;
  min-width: 320px;
  background: #fff;
  margin: 2rem 2rem 2rem 1rem;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem 2rem 2.5rem 2rem;
  @media (max-width: 900px) {
    margin: 0 0 1.5rem 0;
    width: 98vw;
    max-width: 98vw;
    padding: 1.5rem 0.5rem;
  }
`;

const WinnerTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 2rem 0 0.5rem 0;
  text-align: center;
  letter-spacing: -1px;
  span {
    background: #283593;
    color: #fff;
    border-radius: 6px;
    padding: 0.1em 0.4em;
    margin-left: 0.3em;
    font-size: 1.1em;
  }
`;

const WinnerContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const WinnerImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CrownIcon = styled.img`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 70px;
  height: 70px;
  z-index: 2;
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    top: -25px;
    transform: translate(-50%, 0);
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  margin: 0.5rem;
  border: none;
  border-radius: 8px;
  background-color: #1a237e;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #283593;
  }
  @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  margin: 1.5rem 0 0.5rem 0;
  width: 100%;
  justify-content: center;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
    width: 100%;
    align-items: stretch;
  }
`;

const CommentSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
  @media (max-width: 600px) {
    max-width: 100%;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Comment = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

// 저장용 9:16 캡처 영역 스타일
const CaptureArea = styled.div`
  width: 360px;
  height: 640px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f5f5f5;
  padding: 2rem 0 0 0;
  position: absolute;
  left: -9999px; // 화면에서 숨김
`;

// 댓글 삭제 버튼
const DeleteButton = styled.button`
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  margin-left: 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { background: #b71c1c; }
`;

// 답글 입력창 스타일
const ReplyForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;
const ReplyInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
`;
const ReplyButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #283593;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
`;
const ReplyList = styled.div`
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const LikeButton = styled.button`
  background: none;
  border: none;
  color: #e53935;
  font-size: 1.1rem;
  cursor: pointer;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  &:hover { color: #b71c1c; }
`;

const BestLabel = styled.div`
  display: inline-block;
  background: #ffb300;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 6px;
  padding: 0.2em 0.7em;
  margin-right: 0.7em;
`;
const ReplyToggleBtn = styled.button`
  background: none;
  border: none;
  color: #283593;
  font-size: 0.95rem;
  cursor: pointer;
  margin-left: 0.7rem;
  &:hover { text-decoration: underline; }
`;

const Result = () => {
  const [winner, setWinner] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: '', content: '' });
  const resultRef = useRef(null);
  const captureRef = useRef(null);
  const [myName, setMyName] = useState(() => localStorage.getItem('myName') || '');
  const [replyInputs, setReplyInputs] = useState({}); // 댓글별 답글 입력값
  const [replyLists, setReplyLists] = useState({}); // 댓글별 답글 목록
  const [likeStates, setLikeStates] = useState({}); // 댓글별 좋아요 상태
  const [replyOpen, setReplyOpen] = useState({}); // 댓글별 답글 토글 상태

  useEffect(() => {
    // URL에서 우승자 정보 가져오기
    const params = new URLSearchParams(window.location.search);
    const winnerParam = params.get('winner');
    if (winnerParam) {
      const winnerData = JSON.parse(decodeURIComponent(winnerParam));
      setWinner(winnerData);
    } else {
      // 임시 테스트 데이터
      setWinner({
        name: "테스트 우승자",
        image: "/test-winner.png" // public 폴더에 임시 이미지 필요
      });
    }

    // 댓글 실시간 업데이트
    const q = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentList);
    });

    // 우승자 집계 Firestore에 저장
    if (winner && winner.name && winner.image) {
      const saveWinner = async () => {
        const winnerRef = doc(db, 'winners', winner.name);
        const docSnap = await getDoc(winnerRef);
        if (docSnap.exists()) {
          await updateDoc(winnerRef, { count: increment(1) });
        } else {
          await setDoc(winnerRef, { name: winner.name, image: winner.image, count: 1 });
        }
      };
      saveWinner();
    }

    // 댓글별 대댓글(답글) 실시간 리스너
    comments.forEach(comment => {
      const repliesRef = collection(db, 'comments', comment.id, 'replies');
      const q = query(repliesRef, orderBy('timestamp', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setReplyLists(prev => ({
          ...prev,
          [comment.id]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        }));
      });
      // cleanup은 생략(간단 구현)
    });

    // 좋아요 상태 로딩
    const likes = JSON.parse(localStorage.getItem('likedComments') || '{}');
    setLikeStates(likes);

    return () => unsubscribe();
  }, []);

  const handleSaveImage = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current);
      const link = document.createElement('a');
      link.download = 'worldcup-result.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    } catch (err) {
      console.error('링크 복사 실패:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.name || !newComment.content) return;

    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        ...newComment,
        timestamp: new Date(),
      });
      setNewComment({ name: '', content: '' });
      localStorage.setItem('myName', newComment.name); // 이름 저장
      // 댓글 id도 저장 (여러개 작성 가능하니 배열로)
      const myIds = JSON.parse(localStorage.getItem('myCommentIds') || '[]');
      myIds.push(docRef.id);
      localStorage.setItem('myCommentIds', JSON.stringify(myIds));
      setMyName(newComment.name);
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteDoc(doc(db, 'comments', id));
      // localStorage에서도 삭제
      const myIds = JSON.parse(localStorage.getItem('myCommentIds') || '[]');
      localStorage.setItem('myCommentIds', JSON.stringify(myIds.filter(cid => cid !== id)));
    } catch (err) {
      alert('삭제 실패');
    }
  };

  // 답글 입력값 변경
  const handleReplyInput = (commentId, value) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: value }));
  };
  // 답글 작성
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const value = replyInputs[commentId];
    if (!value) return;
    try {
      await addDoc(collection(db, 'comments', commentId, 'replies'), {
        name: myName || '익명',
        content: value,
        timestamp: serverTimestamp(),
      });
      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    } catch (err) {
      alert('답글 작성 실패');
    }
  };
  // 좋아요 클릭
  const handleLike = async (commentId) => {
    // localStorage로 중복 방지
    const likes = JSON.parse(localStorage.getItem('likedComments') || '{}');
    if (likes[commentId]) return;
    try {
      await updateDoc(doc(db, 'comments', commentId), { likes: increment(1) });
      likes[commentId] = true;
      localStorage.setItem('likedComments', JSON.stringify(likes));
      setLikeStates(likes);
    } catch (err) {
      alert('좋아요 실패');
    }
  };

  // 댓글 좋아요 기준 정렬 및 베스트 댓글 추출
  const sortedComments = [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  const bestComments = sortedComments.slice(0, 3);
  const restComments = sortedComments.slice(3);

  // 답글 토글
  const handleReplyToggle = (commentId) => {
    setReplyOpen(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  if (!winner) return <div>Loading...</div>;

  return (
    <MainLayout>
      {/* 좌측: 이미지/타이틀/버튼 */}
      <LeftPanel>
        <WinnerContainer>
          <CrownIcon src="/crown.png" alt="Crown" />
          <WinnerImage src={winner.image} alt={winner.name} />
        </WinnerContainer>
        <ButtonGroup>
          <Button onClick={handleSaveImage}>저장</Button>
          <Button onClick={handleShare}>공유(링크 복사)</Button>
          <Button onClick={() => window.location.href = '/ranking'}>랭킹보기</Button>
        </ButtonGroup>
        <WinnerTitle>
          {winner.name} <span>우승</span>
        </WinnerTitle>
      </LeftPanel>
      {/* 우측: 댓글 */}
      <RightPanel>
        <CommentSection>
          <h3>전체 댓글</h3>
          <CommentList>
            {/* 베스트 댓글 먼저 */}
            {bestComments.map((comment, idx) => {
              const myIds = JSON.parse(localStorage.getItem('myCommentIds') || '[]');
              const canDelete = myName && comment.name === myName && myIds.includes(comment.id);
              return (
                <Comment key={comment.id}>
                  <h4>
                    <BestLabel>BEST {idx+1}</BestLabel>
                    {comment.name}
                    {canDelete && (
                      <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
                        삭제
                      </DeleteButton>
                    )}
                    <LikeButton onClick={() => handleLike(comment.id)} disabled={likeStates[comment.id]}>
                      ❤️ {comment.likes || 0}
                    </LikeButton>
                    <ReplyToggleBtn onClick={() => handleReplyToggle(comment.id)}>
                      답글 {replyLists[comment.id]?.length ? replyLists[comment.id].length : ''}
                    </ReplyToggleBtn>
                  </h4>
                  <p>{comment.content}</p>
                  <small>{new Date(comment.timestamp.toDate()).toLocaleString()}</small>
                  {/* 답글 토글 영역 */}
                  {replyOpen[comment.id] && (
                    <>
                      <ReplyList>
                        {replyLists[comment.id]?.map(reply => (
                          <div key={reply.id} style={{background:'#f7f7fa', borderRadius:6, padding:'0.5rem 1rem'}}>
                            <b>{reply.name}</b>: {reply.content}
                            <span style={{fontSize:'0.85em', color:'#888', marginLeft:8}}>
                              {reply.timestamp?.toDate ? new Date(reply.timestamp.toDate()).toLocaleString() : ''}
                            </span>
                          </div>
                        ))}
                      </ReplyList>
                      <ReplyForm onSubmit={e => handleReplySubmit(e, comment.id)}>
                        <ReplyInput
                          type="text"
                          placeholder="답글 달기"
                          value={replyInputs[comment.id] || ''}
                          onChange={e => handleReplyInput(comment.id, e.target.value)}
                        />
                        <ReplyButton type="submit">등록</ReplyButton>
                      </ReplyForm>
                    </>
                  )}
                </Comment>
              );
            })}
            {/* 나머지 댓글 */}
            {restComments.map((comment) => {
              const myIds = JSON.parse(localStorage.getItem('myCommentIds') || '[]');
              const canDelete = myName && comment.name === myName && myIds.includes(comment.id);
              return (
                <Comment key={comment.id}>
                  <h4>
                    {comment.name}
                    {canDelete && (
                      <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
                        삭제
                      </DeleteButton>
                    )}
                    <LikeButton onClick={() => handleLike(comment.id)} disabled={likeStates[comment.id]}>
                      ❤️ {comment.likes || 0}
                    </LikeButton>
                    <ReplyToggleBtn onClick={() => handleReplyToggle(comment.id)}>
                      답글 {replyLists[comment.id]?.length ? replyLists[comment.id].length : ''}
                    </ReplyToggleBtn>
                  </h4>
                  <p>{comment.content}</p>
                  <small>{new Date(comment.timestamp.toDate()).toLocaleString()}</small>
                  {/* 답글 토글 영역 */}
                  {replyOpen[comment.id] && (
                    <>
                      <ReplyList>
                        {replyLists[comment.id]?.map(reply => (
                          <div key={reply.id} style={{background:'#f7f7fa', borderRadius:6, padding:'0.5rem 1rem'}}>
                            <b>{reply.name}</b>: {reply.content}
                            <span style={{fontSize:'0.85em', color:'#888', marginLeft:8}}>
                              {reply.timestamp?.toDate ? new Date(reply.timestamp.toDate()).toLocaleString() : ''}
                            </span>
                          </div>
                        ))}
                      </ReplyList>
                      <ReplyForm onSubmit={e => handleReplySubmit(e, comment.id)}>
                        <ReplyInput
                          type="text"
                          placeholder="답글 달기"
                          value={replyInputs[comment.id] || ''}
                          onChange={e => handleReplyInput(comment.id, e.target.value)}
                        />
                        <ReplyButton type="submit">등록</ReplyButton>
                      </ReplyForm>
                    </>
                  )}
                </Comment>
              );
            })}
          </CommentList>
          {/* 댓글 작성 폼을 전체 댓글 밑에 위치 */}
          <CommentForm onSubmit={handleCommentSubmit}>
            <Input
              type="text"
              placeholder="이름"
              value={newComment.name}
              onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
            />
            <TextArea
              placeholder="댓글을 작성하세요"
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            />
            <Button type="submit">댓글 작성</Button>
          </CommentForm>
        </CommentSection>
      </RightPanel>
    </MainLayout>
  );
};

export default Result;
