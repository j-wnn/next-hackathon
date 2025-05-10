/**
 * Firestore 테마 데이터 초기화 스크립트
 * 
 * 이 스크립트는 프로젝트의 테마 데이터를 Firestore에 업로드합니다.
 * 각 테마마다 별도의 컬렉션이 생성되고, 각 아이템은 해당 컬렉션의 문서로 추가됩니다.
 */

import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  collection, 
  getDocs, 
  query,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

import { themeItems, themeNames } from '../data/themes';

/**
 * Firestore에 모든 테마와 아이템 데이터를 초기화합니다.
 */
export const initializeThemeData = async () => {
  try {
    console.log('Firestore 테마 데이터 초기화 시작...');
    
    // 각 테마에 대해 처리
    for (const themeName of themeNames) {
      console.log(`"${themeName}" 테마 처리 중...`);
      
      // 테마 아이템 불러오기
      const items = themeItems[themeName];
      
      // 배치 작업 시작 (한 번에 여러 문서 쓰기 작업)
      const batch = writeBatch(db);
      let batchCount = 0;
      
      // 최대 배치 크기 (Firestore 제한: 500)
      const MAX_BATCH_SIZE = 400;
      
      // 각 아이템에 대해
      for (const item of items) {
        // 문서 레퍼런스 생성
        const docRef = doc(db, themeName, item.id.toString());
        
        // 문서 데이터 준비
        const itemData = {
          id: item.id,
          name: item.name,
          image: item.image,
          FinalWinnerCount: 0,
          MatchWinnerCount: 0,
          LossCount: 0,
          matchCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // 배치에 문서 설정 작업 추가
        batch.set(docRef, itemData);
        batchCount++;
        
        // 배치 크기가 최대에 도달하면 커밋하고 새 배치 시작
        if (batchCount >= MAX_BATCH_SIZE) {
          await batch.commit();
          console.log(`${batchCount}개 문서 커밋 완료`);
          
          // 새 배치 시작
          batchCount = 0;
          batch = writeBatch(db);
        }
      }
      
      // 남은 배치 커밋
      if (batchCount > 0) {
        await batch.commit();
        console.log(`남은 ${batchCount}개 문서 커밋 완료`);
      }
      
      console.log(`"${themeName}" 테마 처리 완료 (${items.length}개 아이템)`);
    }
    
    console.log('Firestore 테마 데이터 초기화 완료!');
    return true;
  } catch (error) {
    console.error('Firestore 테마 데이터 초기화 중 오류 발생:', error);
    return false;
  }
};

/**
 * 이미 초기화된 테마 데이터를 확인합니다.
 */
export const checkInitializedThemes = async () => {
  try {
    const results = {};
    
    for (const themeName of themeNames) {
      const themeRef = collection(db, themeName);
      const snapshot = await getDocs(query(themeRef));
      results[themeName] = snapshot.size;
    }
    
    console.log('초기화된 테마 데이터:', results);
    return results;
  } catch (error) {
    console.error('테마 데이터 확인 중 오류 발생:', error);
    return null;
  }
}; 