// 기기(브라우저) UUID를 localStorage에 저장하고 반환
export function getDeviceUUID() {
  let uuid = localStorage.getItem('deviceUUID');
  if (!uuid) {
    uuid = crypto.randomUUID();
    localStorage.setItem('deviceUUID', uuid);
  }
  return uuid;
} 