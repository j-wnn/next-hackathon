import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import html2canvas from 'html2canvas';
import { 
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
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase'; // db를 직접 가져오기
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/home.css"; // Import home styling

// 2단 레이아웃
const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  min-height: 100%;
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`;

const PanelBase = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LeftPanel = styled(PanelBase)`
  flex: 2 1 0;
  max-width: 855px;
  min-width: 340px;
  margin: 2rem 1rem 2rem 2rem;
  padding: 2.5rem 2rem 2.5rem 2rem;
  @media (max-width: 900px) {
    margin: 1rem 0;
    width: 98vw;
    max-width: 98vw;
    padding: 1.5rem 0.5rem;
  }
`;

const RightPanel = styled(PanelBase)`
  flex: 1 1 0;
  max-width: 600px;
  min-width: 320px;
  margin: 2rem 2rem 2rem 1rem;
  padding: 2.5rem 2rem 2.5rem 2rem;
  @media (max-width: 900px) {
    margin: 0 0 1.5rem 0;
    width: 98vw;
    max-width: 98vw;
    padding: 1.5rem 0.5rem;
  }
`;

const WinnerTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 900;
  margin: 2rem 0 0.5rem 0;
  text-align: center;
  letter-spacing: -1px;
  color: #000;
  background: none;
  span {
    background: #8b0029;
    color: #fff;
    border-radius: 8px;
    padding: 0.1em 0.7em;
    margin-left: 0.3em;
    font-size: 1.1em;
    font-weight: 900;
    border: 3px solid #000;
    box-shadow: 4px 4px 0 #000;
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
  border: 3px solid #8b0029;
  box-shadow: 6px 6px 0 #000;
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
  padding: 0.9rem 1.7rem;
  margin: 0.5rem;
  border: 3px solid #000;
  border-radius: 10px;
  background-color: #8b0029;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s;
  &:hover {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.7rem 1.1rem;
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
  border: 3px solid #000;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  background: #fff;
  color: #000;
  box-shadow: 2px 2px 0 #8b0029;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 3px solid #000;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  background: #fff;
  color: #000;
  min-height: 100px;
  resize: vertical;
  box-shadow: 2px 2px 0 #8b0029;
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Comment = styled.div`
  padding: 1.1rem 1.2rem;
  background-color: #fff;
  border-radius: 10px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #8b0029;
  font-size: 1.08rem;
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
  background: #fff;
  color: #8b0029;
  border: 3px solid #8b0029;
  border-radius: 6px;
  padding: 0.3rem 0.9rem;
  margin-left: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.2s;
  &:hover { 
    transform: translate(2px, 2px);
    box-shadow: none;
  }
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
  border: 2px solid #8b0029;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  background: #fff;
  color: #000;
`;
const ReplyButton = styled.button`
  padding: 0.5rem 1.1rem;
  border: 2px solid #8b0029;
  border-radius: 6px;
  background: #8b0029;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.2s;
  &:hover { 
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;
const ReplyList = styled.div`
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const LikeButton = styled.button`
  background: #fff;
  border: 2px solid #8b0029;
  color: #8b0029;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border-radius: 6px;
  box-shadow: 2px 2px 0 #000;
  padding: 0.2rem 0.7rem;
  transition: all 0.2s;
  &:hover { 
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;

const BestLabel = styled.div`
  display: inline-block;
  background: #8b0029;
  color: #fff;
  font-weight: 900;
  font-size: 1.05rem;
  border-radius: 8px;
  padding: 0.2em 0.9em;
  margin-right: 0.7em;
  border: 2.5px solid #000;
  box-shadow: 2px 2px 0 #000;
`;
const ReplyToggleBtn = styled.button`
  background: #fff;
  border: 2px solid #8b0029;
  color: #8b0029;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-left: 0.7rem;
  border-radius: 6px;
  box-shadow: 2px 2px 0 #000;
  padding: 0.2rem 0.7rem;
  transition: all 0.2s;
  &:hover { 
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;

const Result = () => {
  const resultRef = useRef(null);
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [firebaseError, setFirebaseError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get winner and theme from location state or set defaults
  const winner = location.state?.winner || {
    artistName: "우승자",
    image: "https://via.placeholder.com/500x500.png?text=Winner"
  };
  const theme = location.state?.theme || "이상형 월드컵";
  const totalRound = location.state?.totalRound || 8;

  useEffect(() => {
    try {
      // Get comments from Firestore
      const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const commentsArray = [];
        querySnapshot.forEach((doc) => {
          commentsArray.push({ id: doc.id, ...doc.data() });
        });
        setComments(commentsArray);
        setFirebaseError(false);
      }, (error) => {
        console.error("Error fetching comments:", error);
        setFirebaseError(true);
      });
      
      // Save winner to Firestore if available
      if (location.state?.winner) {
        saveWinner().catch(err => {
          console.error("Failed to save winner:", err);
          setFirebaseError(true);
        });
      }
      
      return () => {
        try {
          unsubscribe();
        } catch (err) {
          console.error("Error unsubscribing:", err);
        }
      };
    } catch (error) {
      console.error("Error setting up Firebase listeners:", error);
      setFirebaseError(true);
    }
  }, [location.state]);

  const saveWinner = async () => {
    try {
      // Add winner info to Firestore
      const winnerRef = collection(db, "winners");
      await addDoc(winnerRef, {
        artistName: winner.artistName,
        image: winner.image,
        theme: theme,
        totalRound: totalRound,
        timestamp: serverTimestamp()
      });
      console.log("Winner saved to database");
      return true;
    } catch (error) {
      console.error("Error saving winner:", error);
      // Silent fail - don't disrupt user experience
      return false;
    }
  };

  const handleSaveImage = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current);
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

  const handleViewRanking = () => {
    navigate('/ranking', { state: { theme: theme } });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!nickname || !comment) {
      alert('닉네임과 댓글 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        nickname,
        comment,
        timestamp: new Date(),
        likes: 0 // Initialize likes count
      });
      setNickname('');
      setComment('');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      alert('댓글을 저장할 수 없습니다. 나중에 다시 시도해주세요.');
    }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await deleteDoc(doc(db, 'comments', id));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      alert('삭제에 실패했습니다. 나중에 다시 시도해주세요.');
    }
  };

  const handleReplyInput = (commentId, value) => {
    setReplyText(prev => ({ ...prev, [commentId]: value }));
  };

  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    const value = replyText[commentId];
    if (!value) {
      alert('답글 내용을 입력해주세요.');
      return;
    }
    if (!nickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    
    try {
      await addDoc(collection(db, 'comments', commentId, 'replies'), {
        nickname,
        comment: value,
        timestamp: serverTimestamp(),
      });
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
    } catch (err) {
      console.error('답글 작성 실패:', err);
      alert('답글을 저장할 수 없습니다. 나중에 다시 시도해주세요.');
    }
  };

  const handleLike = async (commentId) => {
    // localStorage로 중복 방지
    const likes = JSON.parse(localStorage.getItem('likedComments') || '{}');
    if (likes[commentId]) {
      alert('이미 좋아요를 누르셨습니다.');
      return;
    }
    
    try {
      await updateDoc(doc(db, 'comments', commentId), { likes: increment(1) });
      likes[commentId] = true;
      localStorage.setItem('likedComments', JSON.stringify(likes));
    } catch (err) {
      console.error('좋아요 실패:', err);
      alert('좋아요를 처리할 수 없습니다. 나중에 다시 시도해주세요.');
    }
  };

  const sortedComments = [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  const bestComments = sortedComments.slice(0, 3);
  const restComments = sortedComments.slice(3);

  const handleReplyToggle = (commentId) => {
    setShowReplyInput(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  return (
    <div className="home-root">
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32, maxWidth: '100%', width: '100%' }}>
        <Header />
        
        <MainLayout>
          <LeftPanel>
            <WinnerContainer>
              <CrownIcon src="/crown.png" alt="Crown" />
              <WinnerImage src={winner.image} alt={winner.artistName} />
            </WinnerContainer>
            <ButtonGroup>
              <Button onClick={handleSaveImage}>저장</Button>
              <Button onClick={handleShare}>공유(링크 복사)</Button>
              <Button onClick={handleViewRanking}>랭킹 보기</Button>
            </ButtonGroup>
            <WinnerTitle>
              {winner.artistName} <span>{theme} {totalRound}강</span>
            </WinnerTitle>
          </LeftPanel>
          <RightPanel>
            {firebaseError ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h3>댓글 기능을 사용할 수 없습니다</h3>
                <p>Firebase 연결 오류로 댓글 서비스를 사용할 수 없습니다. 나중에 다시 시도해주세요.</p>
              </div>
            ) : (
              <CommentSection>
                <h3>전체 댓글</h3>
                <CommentList>
                  {bestComments.map((comment, idx) => {
                    const myIds = JSON.parse(localStorage.getItem('myCommentIds') || '[]');
                    const canDelete = nickname && comment.nickname === nickname && myIds.includes(comment.id);
                    return (
                      <Comment key={comment.id}>
                        <h4>
                          <BestLabel>BEST {idx+1}</BestLabel>
                          {comment.nickname}
                          {canDelete && (
                            <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
                              삭제
                            </DeleteButton>
                          )}
                          <LikeButton onClick={() => handleLike(comment.id)} disabled={JSON.parse(localStorage.getItem('likedComments') || '{}')[comment.id]}>
                            ❤️ {comment.likes || 0}
                          </LikeButton>
                          <ReplyToggleBtn onClick={() => handleReplyToggle(comment.id)}>
                            답글 {replyText[comment.id]?.length ? replyText[comment.id].length : ''}
                          </ReplyToggleBtn>
                        </h4>
                        <p>{comment.comment}</p>
                        <small>{new Date(comment.timestamp.toDate()).toLocaleString()}</small>
                        {showReplyInput[comment.id] && (
                          <>
                            <ReplyList>
                              {replyText[comment.id]?.map(reply => (
                                <div key={reply.id} style={{background:'#f7f7fa', borderRadius:6, padding:'0.5rem 1rem'}}>
                                  <b>{reply.nickname}</b>: {reply.comment}
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
                                value={replyText[comment.id] || ''}
                                onChange={e => handleReplyInput(comment.id, e.target.value)}
                              />
                              <ReplyButton type="submit">등록</ReplyButton>
                            </ReplyForm>
                          </>
                        )}
                      </Comment>
                    );
                  })}
                  {restComments.map((comment) => {
                    const myIds = JSON.parse(localStorage.getItem('myCommentIds') || '[]');
                    const canDelete = nickname && comment.nickname === nickname && myIds.includes(comment.id);
                    return (
                      <Comment key={comment.id}>
                        <h4>
                          {comment.nickname}
                          {canDelete && (
                            <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
                              삭제
                            </DeleteButton>
                          )}
                          <LikeButton onClick={() => handleLike(comment.id)} disabled={JSON.parse(localStorage.getItem('likedComments') || '{}')[comment.id]}>
                            ❤️ {comment.likes || 0}
                          </LikeButton>
                          <ReplyToggleBtn onClick={() => handleReplyToggle(comment.id)}>
                            답글 {replyText[comment.id]?.length ? replyText[comment.id].length : ''}
                          </ReplyToggleBtn>
                        </h4>
                        <p>{comment.comment}</p>
                        <small>{new Date(comment.timestamp.toDate()).toLocaleString()}</small>
                        {showReplyInput[comment.id] && (
                          <>
                            <ReplyList>
                              {replyText[comment.id]?.map(reply => (
                                <div key={reply.id} style={{background:'#f7f7fa', borderRadius:6, padding:'0.5rem 1rem'}}>
                                  <b>{reply.nickname}</b>: {reply.comment}
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
                                value={replyText[comment.id] || ''}
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
                <CommentForm onSubmit={handleCommentSubmit}>
                  <Input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                  <TextArea
                    placeholder="댓글을 작성하세요"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button type="submit">댓글 작성</Button>
                </CommentForm>
              </CommentSection>
            )}
          </RightPanel>
        </MainLayout>
        
        <Footer />
      </div>
    </div>
  );
};

export default Result;
