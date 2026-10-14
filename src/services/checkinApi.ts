import { invoke } from '@tauri-apps/api/core';
import { CheckinStatus } from '../types';

export const SUPPORTED_CHECKIN_BIZ = ['nap_global', 'hkrpg_global', 'hk4e_global', 'bh3_global'];

export async function getCheckinInfo(
  biz: string,
  cookie: string,
  lang: string
): Promise<CheckinStatus | null> {
  if (!cookie) return null;
  const resRaw = await invoke<string>('checkin_get_info', { biz, cookie, lang });
  const res = JSON.parse(resRaw);
  if (res.retcode === 0 && res.data) {
    return res.data;
  }
  return null;
}

export async function executeCheckin(
  biz: string,
  cookie: string,
  lang: string
): Promise<{ success: boolean; message: string; alreadySigned: boolean }> {
  const resRaw = await invoke<string>('checkin_execute', { biz, cookie, lang });
  const res = JSON.parse(resRaw);
  if (res.retcode === 0) {
    return { success: true, message: 'Điểm danh thành công! Quà đã gửi vào hòm thư.', alreadySigned: false };
  }
  if (res.retcode === -5003) {
    return { success: true, message: 'Hôm nay bạn đã điểm danh tựa game này rồi!', alreadySigned: true };
  }
  return { success: false, message: res.message || `Lỗi điểm danh mã ${res.retcode}`, alreadySigned: false };
}

export async function executeCheckinAll(
  cookie: string,
  lang: string
): Promise<{ successCount: number; total: number }> {
  let successCount = 0;
  for (const biz of SUPPORTED_CHECKIN_BIZ) {
    try {
      const res = await executeCheckin(biz, cookie, lang);
      if (res.success) successCount++;
    } catch {
      // continue next
    }
  }
  return { successCount, total: SUPPORTED_CHECKIN_BIZ.length };
}
