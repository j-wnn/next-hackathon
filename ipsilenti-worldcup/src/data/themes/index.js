/**
 * 테마 데이터 통합 인덱스
 */
import { lineupItems } from './lineup';
import { cheeringItems } from './cheering';
import { makgeolliItems } from './makgeolli';
import { anamPubItems } from './anam-pub';
import { mascotItems } from './mascot';

/**
 * 테마 이름과 아이템 데이터 매핑
 */
export const themeItems = {
  "라인업 월드컵": lineupItems,
  "응원가 월드컵": cheeringItems,
  "막걸리 월드컵": makgeolliItems,
  "안암 술집 월드컵": anamPubItems,
  "마스코트 월드컵": mascotItems
};

/**
 * 테마 이름 목록 (필요한 경우 사용)
 */
export const themeNames = Object.keys(themeItems);

/**
 * 테마별 아이템 개수
 */
export const themeItemCounts = {
  "라인업 월드컵": lineupItems.length,
  "응원가 월드컵": cheeringItems.length,
  "막걸리 월드컵": makgeolliItems.length,
  "안암 술집 월드컵": anamPubItems.length,
  "마스코트 월드컵": mascotItems.length
};

/**
 * 특정 테마의 아이템 가져오기
 * @param {string} themeName - 테마 이름
 * @returns {Array} - 해당 테마의 아이템 배열
 */
export const getThemeItems = (themeName) => {
  return themeItems[themeName] || lineupItems; // 없으면 기본으로 라인업 데이터 반환
}; 