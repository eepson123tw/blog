import 'dayjs/locale/zh-tw';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.locale('zh-tw');
dayjs.extend(relativeTime);

export function getDate(date:Date|string) {
  if (date) {
    const time = dayjs(date instanceof Date ? date : date.trim());
    if (time.isValid()) {
      const currentTime = dayjs(date).utc().local().format('YYYY-MM-DD');
      return currentTime;
    }
  }
  return null;
}

export function getFromNow(date:Date) {
  if (date) return dayjs(date).utc().local().fromNow();

  return null;
}
