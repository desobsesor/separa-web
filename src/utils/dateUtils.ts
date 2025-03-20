/**
 * Utilities for handling dates and times consistently throughout the application
 */

/**
 * Gets the current date in YYYY-MM-DD format considering the local timezone
 * @returns {string} Current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
    const now = new Date();
    return formatDateToLocalYYYYMMDD(now);
};

/**
 * Gets the next day's date in YYYY-MM-DD format considering the local timezone
 * @returns {string} Next day's date in YYYY-MM-DD format
 */
export const getNextDayDate = (): string => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return formatDateToLocalYYYYMMDD(now);
};

/**
 * Formats a date to YYYY-MM-DD format considering the local timezone
 * @param {Date} date - Date object to format
 * @returns {string} Date formatted in YYYY-MM-DD
 */
export const formatDateToLocalYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Converts an ISO date to local YYYY-MM-DD format
 * @param {string} isoDate - Date in ISO format
 * @returns {string} Date in YYYY-MM-DD format
 */
export const isoToLocalDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return formatDateToLocalYYYYMMDD(date);
};

/**
 * Converts a time in HH:MM format to minutes since midnight
 * @param {string} time - Time in HH:MM format
 * @returns {number} Minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * Combines a date in YYYY-MM-DD format and a time in HH:MM format
 * to create a Date object in the local timezone
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {string} timeStr - Time in HH:MM format
 * @returns {Date} Combined Date object
 */
export const combineDateAndTime = (dateStr: string, timeStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
};

/**
 * Converts a Date object to ISO string but preserving the local timezone
 * @param {Date} date - Date object to convert
 * @returns {string} Date in ISO format with local timezone
 */
export const dateToLocalISOString = (date: Date): string => {
    const pad = (num: number) => String(num).padStart(2, '0');
    console.log(pad, date);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

/**
 * Extracts the time in HH:MM format from an ISO date
 * @param {string} isoDate - Date in ISO format
 * @returns {string} Time in HH:MM format
 */
export const extractTimeFromISOString = (isoDate: string): string => {
    const date = new Date(isoDate);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};