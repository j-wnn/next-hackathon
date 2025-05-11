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
import { getDeviceUUID } from '../utils/device';

// 2단 레이아웃
const MainLayout = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  min-height: 100%;
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 1.5rem;
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
  max-width: 800px;
  min-width: 400px;
  margin: 2rem 0;
  padding: 3rem 2.5rem 3rem 2.5rem;
  position: relative;
  
  @media (max-width: 900px) {
    margin: 1rem 0;
    width: 95%;
    max-width: 600px;
    min-width: 320px;
    padding: 2rem 1.5rem;
  }
`;

const HomeButton = styled.button`
  padding: 0.8rem 1.4rem;
  border: 3px solid #000;
  border-radius: 10px;
  background-color: #8b0029;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
  transition: all 0.2s;
  overflow: hidden;
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover {
    transform: translate(4px, 4px);
    box-shadow: none;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translate(4px, 4px);
    box-shadow: none;
  }
  
  @media (max-width: 600px) {
    font-size: 0.9rem;
    padding: 0.5rem 0.9rem;
    top: 0.8rem;
    right: 1rem;
  }
`;

const TopSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  max-width: 550px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 4rem;
  
  @media (max-width: 600px) {
    margin-bottom: 1rem;
    padding-top: 3.5rem;
  }
`;

const ChampionLabel = styled.div`
  background: #8b0029;
  color: #fff;
  border-radius: 12px;
  padding: 0.7em 1.2em;
  font-size: 1.6rem;
  font-weight: 900;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  display: block;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
  
  @media (max-width: 600px) {
    font-size: 1.2rem;
    padding: 0.5em 1em;
  }
`;

const WinnerContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 1rem;
  
  @media (max-width: 600px) {
    margin-bottom: 1rem;
    padding-top: 0.5rem;
  }
`;

const WinnerImage = styled.img`
  width: 100%;
  max-width: 550px;
  height: auto;
  max-height: 650px;
  object-fit: contain;
  border-radius: 15px;
  border: 5px solid #000;
  box-shadow: 8px 8px 0 #8b0029;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
  
  @media (max-width: 600px) {
    max-width: 100%;
    max-height: 500px;
    border: 4px solid #000;
    box-shadow: 6px 6px 0 #8b0029;
  }
`;

const CrownIcon = styled.img`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 100px;
  height: 100px;
  filter: drop-shadow(4px 4px 0px #000);
  z-index: 2;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translate(-50%, 0px); }
    50% { transform: translate(-50%, -10px); }
    100% { transform: translate(-50%, 0px); }
  }
  
  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    top: -20px;
  }
`;

const WinnerTitle = styled.div`
  font-size: 3rem;
  color: #222;
  font-weight: 900;
  margin: 0.5rem 0 1.5rem 0;
  text-align: center;
  letter-spacing: -1px;
  line-height: 1.2;
  width: 100%;
  word-break: keep-all;
  
  @media (max-width: 600px) {
    font-size: 2.2rem;
    margin: 0.5rem 0 1rem 0;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #000;
  margin: 0.5rem auto 2.5rem;
  border-radius: 0;
  
  @media (max-width: 600px) {
    margin: 0.5rem auto 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  margin: 0 0 1rem 0;
  width: 100%;
  justify-content: center;
  
  @media (max-width: 900px) {
    gap: 1.2rem;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
    width: 90%;
    align-items: stretch;
  }
`;

const Button = styled.button`
  padding: 1rem 2rem;
  margin: 0;
  border: 3px solid #000;
  border-radius: 10px;
  background-color: #8b0029;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 6px 6px 0 #000;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  min-width: 200px;
  flex: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover {
    transform: translate(4px, 4px);
    box-shadow: 2px 2px 0 #000;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translate(6px, 6px);
    box-shadow: none;
  }
  
  @media (max-width: 900px) {
    padding: 0.9rem 1.7rem;
    font-size: 1.1rem;
    min-width: 180px;
  }
  
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 0.8rem 1.5rem;
    width: 100%;
  }
`;

const RightPanel = styled(PanelBase)`
  flex: 1 1 0;
  max-width: 550px;
  min-width: 350px;
  margin: 2rem 0;
  padding: 3rem 2.5rem;
  
  @media (max-width: 900px) {
    margin: 0 0 1.5rem 0;
    width: 95%;
    max-width: 600px;
    min-width: 320px;
    padding: 2rem 1.5rem;
  }
`;

const CommentSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 0.5rem;
  
  @media (max-width: 600px) {
    max-width: 100%;
    margin-top: 0;
  }
`;

const CommentHeader = styled.h3`
  font-size: 1.8rem;
  display: flex;
  align-items: baseline;
  gap: 0.2em;
  margin-bottom: 1.5rem;
  
  span {
    font-weight: 700;
    font-size: 1em;
    color: #8b0029;
    line-height: 1;
    margin-left: 0.2em;
  }
  
  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 1.2rem;
  }
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
  
  @media (max-width: 600px) {
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border: 3px solid #000;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  background: #fff;
  color: #000;
  box-shadow: 2px 2px 0 #8b0029;
  
  @media (max-width: 600px) {
    padding: 0.8rem;
    font-size: 1rem;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 3px solid #000;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  background: #fff;
  color: #000;
  min-height: 120px;
  resize: vertical;
  box-shadow: 2px 2px 0 #8b0029;
  
  @media (max-width: 600px) {
    padding: 0.8rem;
    font-size: 1rem;
    min-height: 100px;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 600px) {
    gap: 1.2rem;
  }
`;

const Comment = styled.div`
  padding: 1.3rem 1.5rem;
  background-color: #fff;
  border-radius: 10px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #8b0029;
  font-size: 1.1rem;
  
  @media (max-width: 600px) {
    padding: 1rem 1.2rem;
    font-size: 1rem;
  }
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
  border: 2px solid #8b0029;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.9rem;
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
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border-radius: 6px;
  box-shadow: 2px 2px 0 #000;
  padding: 0.2rem 0.5rem;
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
  font-size: 0.95rem;
  border-radius: 8px;
  padding: 0.2em 0.7em;
  margin-bottom: 0.4rem;
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
`;
const ReplyToggleBtn = styled.button`
  background: #fff;
  border: 2px solid #8b0029;
  color: #8b0029;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  border-radius: 6px;
  box-shadow: 2px 2px 0 #000;
  padding: 0.2rem 0.5rem;
  transition: all 0.2s;
  &:hover { 
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;

// 크림슨 테마 저장용 캡처 영역
const CrimsonCaptureArea = styled.div`
  width: 600px;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(139,0,41,0.12);
  overflow: hidden;
  position: absolute;
  left: -9999px; // 화면에서 숨김
  top: 0;
`;

const CommentButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
`;

// Add a new styled component for the animation
const NewCommentHighlight = styled.div`
  position: relative;
  overflow: hidden;
  
  @keyframes highlight-pulse {
    0% { background-color: rgba(139, 0, 41, 0.1); }
    50% { background-color: rgba(139, 0, 41, 0.2); }
    100% { background-color: rgba(139, 0, 41, 0.1); }
  }
  
  &.is-new {
    animation: highlight-pulse 1.5s ease-in-out 3;
    &::before {
      content: '새 댓글';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background-color: #8b0029;
      color: white;
      font-size: 0.8rem;
      font-weight: bold;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      opacity: 1;
      transition: opacity.5s ease-out;
    }
  }
`;

// Add these styled components for pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.8rem;
`;

const PageButton = styled.button`
  border: 2px solid #000;
  background-color: ${props => props.active ? '#8b0029' : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  font-weight: bold;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #000;
  transition: all 0.2s;
  
  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 3px 3px 0 #000;
  }
`;

const PageInfo = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  padding: 0 1rem;
`;

const Result = () => {
  const resultRef = useRef(null);
  const crimsonRef = useRef(null);
  const [nickname, setNickname] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [firebaseError, setFirebaseError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [recentCommentId, setRecentCommentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  
  // Get winner and theme from location state or set defaults
  const winner = location.state?.winner || {
    name: "우승자",
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
          
          // 각 댓글에 대한 대댓글 가져오기
          fetchReplies(doc.id);
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

  // 대댓글 가져오는 함수
  const fetchReplies = async (commentId) => {
    try {
      const replyQuery = query(
        collection(db, "comments", commentId, "replies"),
        orderBy("timestamp", "asc")
      );
      
      const unsubscribe = onSnapshot(replyQuery, (replySnapshot) => {
        const replyList = [];
        replySnapshot.forEach((replyDoc) => {
          replyList.push({ id: replyDoc.id, ...replyDoc.data() });
        });
        
        setReplies(prev => ({
          ...prev,
          [commentId]: replyList
        }));
      });
      
      // cleanup 함수 반환 (필요 시 사용)
      return unsubscribe;
    } catch (error) {
      console.error(`Error fetching replies for comment ${commentId}:`, error);
    }
  };

  const saveWinner = async () => {
    try {
      // Add winner info to Firestore
      const winnerRef = collection(db, "winners");
      await addDoc(winnerRef, {
        name: winner.name,
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
    if (crimsonRef.current) {
      const canvas = await html2canvas(crimsonRef.current, { backgroundColor: '#fff' });
      const link = document.createElement('a');
      link.download = 'ipselenti-favorite.png';
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
    navigate('/ranking', { 
      state: { 
        theme: theme,
        fromResult: true,
        resultData: {
          winner: winner,
          theme: theme,
          totalRound: totalRound
        }
      } 
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!nickname || !comment) {
      alert('닉네임과 댓글 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const deviceUUID = getDeviceUUID();
      const docRef = await addDoc(collection(db, 'comments'), {
        nickname,
        comment,
        timestamp: serverTimestamp(),
        likes: 0, // Initialize likes count
        deviceUUID // ← 기기 UUID 저장
      });
      
      // Set this as the recent comment
      setRecentCommentId(docRef.id);
      
      // Remove the highlight after 10 seconds
      setTimeout(() => {
        setRecentCommentId(null);
      }, 10000);
      
      // 내가 작성한 댓글 ID 저장 (삭제 권한용, 백업용)
      const myCommentIds = JSON.parse(localStorage.getItem('myCommentIds') || '[]');
      myCommentIds.push(docRef.id);
      localStorage.setItem('myCommentIds', JSON.stringify(myCommentIds));
      
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
      const replyRef = await addDoc(collection(db, 'comments', commentId, 'replies'), {
        nickname,
        comment: value,
        timestamp: serverTimestamp(),
      });
      
      // 입력 필드 초기화
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

  const sortedByLikes = [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));
  const bestComments = sortedByLikes.slice(0, 3);
  
  // Filter out BEST comments, sort by timestamp, and paginate
  const nonBestComments = [...comments]
    .filter(comment => !bestComments.some(best => best.id === comment.id))
    .sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return b.timestamp.seconds - a.timestamp.seconds;
      }
      return 0;
    });
  
  // Calculate pagination values
  const totalNonBestComments = nonBestComments.length;
  const totalPages = Math.ceil(totalNonBestComments / commentsPerPage);
  
  // Get comments for current page
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = nonBestComments.slice(indexOfFirstComment, indexOfLastComment);
  
  // Pagination control handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleReplyToggle = (commentId) => {
    setShowReplyInput(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // 댓글 삭제 버튼 노출 조건
  // 기존: 닉네임 && localStorage myCommentIds 포함
  // 변경: deviceUUID 비교
  const deviceUUID = getDeviceUUID();

  // 총 댓글+답글 수 계산
  const totalReplyCount = Object.values(replies).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  const totalCommentAndReplyCount = comments.length + totalReplyCount;

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="home-root">
      {/* 강제 HEX 색상 적용 (oklch 오류 방지) */}
      <style>{`
        html, body, #root, .home-root, .container {
          background: #ffffff !important;
          color: #000000 !important;
        }
      `}</style>
      <div className="container" style={{ minHeight: 'auto', justifyContent: 'flex-start', paddingTop: 32, maxWidth: '100%', width: '100%' }}>
        <Header onTitleClick={handleGoHome} />
        
        <MainLayout>
          <LeftPanel>
            <HomeButton onClick={handleGoHome}>처음으로</HomeButton>
            <TopSection>
              <ChampionLabel>
                {theme} 우승!
              </ChampionLabel>
            </TopSection>
            
            <WinnerContainer>
              <CrownIcon src="/crown.png" alt="Crown" />
              <WinnerImage src={winner.image} alt={winner.name} />
            </WinnerContainer>
            
            <WinnerTitle>
              {winner.name}
            </WinnerTitle>
            
            <Divider />
            
            <ButtonGroup>
              <Button onClick={handleShare}>공유(링크 복사)</Button>
              <Button onClick={handleViewRanking}>랭킹 보기</Button>
            </ButtonGroup>
          </LeftPanel>
          <RightPanel>
            {firebaseError ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <h3>댓글 기능을 사용할 수 없습니다</h3>
                <p>Firebase 연결 오류로 댓글 서비스를 사용할 수 없습니다. 나중에 다시 시도해주세요.</p>
              </div>
            ) : (
              <CommentSection>
                <CommentHeader>
                  전체 댓글
                  <span>({totalCommentAndReplyCount}개)</span>
                </CommentHeader>
                
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
                
                <CommentList>
                  {/* Always render BEST comments */}
                  {bestComments.map((comment, idx) => {
                    const canDelete = comment.deviceUUID === deviceUUID;
                    const isNew = comment.id === recentCommentId;
                    return (
                      <NewCommentHighlight key={comment.id} className={isNew ? 'is-new' : ''}>
                        <Comment>
                          <BestLabel>BEST {idx+1}</BestLabel>
                          <h4>
                            {comment.nickname}
                          </h4>
                          <p>{comment.comment}</p>
                          <small>{comment.timestamp?.toDate ? new Date(comment.timestamp.toDate()).toLocaleString() : ''}</small>
                          <CommentButtonGroup>
                            {canDelete && (
                              <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
                                삭제
                              </DeleteButton>
                            )}
                            <LikeButton onClick={() => handleLike(comment.id)} disabled={JSON.parse(localStorage.getItem('likedComments') || '{}')[comment.id]}>
                              ❤️ {comment.likes || 0}
                            </LikeButton>
                            <ReplyToggleBtn onClick={() => handleReplyToggle(comment.id)}>
                              답글 {replies[comment.id]?.length || 0}
                            </ReplyToggleBtn>
                          </CommentButtonGroup>
                          {showReplyInput[comment.id] && (
                            <>
                              <ReplyList>
                                {replies[comment.id]?.map(reply => (
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
                      </NewCommentHighlight>
                    );
                  })}
                  
                  {/* Render paginated comments */}
                  {currentComments.map((comment) => {
                    const canDelete = comment.deviceUUID === deviceUUID;
                    const isNew = comment.id === recentCommentId;
                    return (
                      <NewCommentHighlight key={comment.id} className={isNew ? 'is-new' : ''}>
                        <Comment>
                          <h4>
                            {comment.nickname}
                          </h4>
                          <p>{comment.comment}</p>
                          <small>{comment.timestamp?.toDate ? new Date(comment.timestamp.toDate()).toLocaleString() : ''}</small>
                          <CommentButtonGroup>
                            {canDelete && (
                              <DeleteButton onClick={() => handleDeleteComment(comment.id)}>
                                삭제
                              </DeleteButton>
                            )}
                            <LikeButton onClick={() => handleLike(comment.id)} disabled={JSON.parse(localStorage.getItem('likedComments') || '{}')[comment.id]}>
                              ❤️ {comment.likes || 0}
                            </LikeButton>
                            <ReplyToggleBtn onClick={() => handleReplyToggle(comment.id)}>
                              답글 {replies[comment.id]?.length || 0}
                            </ReplyToggleBtn>
                          </CommentButtonGroup>
                          {showReplyInput[comment.id] && (
                            <>
                              <ReplyList>
                                {replies[comment.id]?.map(reply => (
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
                      </NewCommentHighlight>
                    );
                  })}
                </CommentList>
                
                {/* Pagination controls */}
                {totalPages > 0 && (
                  <PaginationContainer>
                    <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                      이전
                    </PageButton>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        // If 5 or fewer pages, show all page numbers
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // If near the start, show first 5 pages
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // If near the end, show last 5 pages
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Otherwise show current page and 2 on each side
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PageButton 
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PageButton>
                      );
                    })}
                    
                    <PageButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                      다음
                    </PageButton>
                  </PaginationContainer>
                )}
              </CommentSection>
            )}
          </RightPanel>
        </MainLayout>
        
        <Footer />
      </div>
      {/* 크림슨 테마 저장용 캡처 영역 (숨김) */}
      <CrimsonCaptureArea ref={crimsonRef}>
        {/* 상단 헤더 */}
        <div style={{
          width: '100%',
          background: '#8b0029',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '2.5rem',
          textAlign: 'center',
          padding: '1.2em 0 0.7em 0',
          letterSpacing: '-1px',
          fontFamily: 'inherit',
        }}>
          Ipselenti 최애
        </div>
        {/* 중앙 이미지 */}
        <div style={{flex: 1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%'}}>
          <img
            src={winner.image}
            alt={winner.artistName}
            style={{
              width: '320px',
              height: '320px',
              objectFit: 'cover',
              margin: '2.5em 0 1.2em 0'
            }}
          />
          <div style={{
            fontWeight: 900,
            fontSize: '2.1rem',
            color: '#222222',
            marginBottom: '0.5em',
            textAlign: 'center',
            letterSpacing: '-1px',
          }}>
            {winner.artistName}
          </div>
        </div>
        {/* 하단 문구 */}
        <div style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '1.25rem',
          color: '#ffffff',
          fontWeight: 700,
          padding: '1.5em 0 1.5em 0',
          background: '#8b0029',
        }}>
          당신의 최애는 바로 <span style={{fontWeight:900, color:'#fff'}}>{winner.artistName}</span>!<br/>
          <span style={{fontWeight:900}}>Ipselenti 월드컵에서 우승했어요 🎉</span>
        </div>
      </CrimsonCaptureArea>
    </div>
  );
};

export default Result;
