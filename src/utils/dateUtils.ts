/**
 * 取得給定日期該週的週一
 */
export const getMonday = (d: Date): Date => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
};

/**
 * 日期加減天數
 */
export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

/**
 * 格式化為 YYYY-MM-DD，使用 sv-SE 確保時區正確且格式統一
 */
export const formatDateISO = (date: Date): string => {
    return date.toLocaleDateString('sv-SE');
};

/**
 * 生成 09:00 ~ 17:30 的時間陣列
 */
export const generateTimeSlots = (): string[] => {
    return Array.from({ length: 18 }, (_, i) => {
        const hour = Math.floor(i / 2) + 9;
        const min = (i % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    });
};