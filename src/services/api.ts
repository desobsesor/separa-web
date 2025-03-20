import axios from 'axios';
import config from '../config/env.json';
import { getCurrentDate } from '@/utils/dateUtils';

export interface TimeBlock {
  _id: string;
  startTime: string;
  endTime: string;
  attachedUser: any;
  style: string;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  style?: string;
}

export interface CreateUserData {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface CreateBlockData {
  startTime: string;
  endTime: string;
  attachedUser: string;
  style: string;
}

/**
 * Base URL for the API obtained from environment configuration
 * @constant {string}
 */
const apiBaseUrl = config.development.apiBaseUrl;

/**
 * Preconfigured Axios instance for making HTTP requests
 * @constant {import('axios').AxiosInstance}
 * @default
 * @property {string} baseURL - The base URL for all requests
 * @property {number} timeout - Request timeout in milliseconds
 * @property {Object} headers - Default headers for all requests
 */
const api = axios.create({
  baseURL: `${apiBaseUrl}`,
  timeout: 10000,
  headers: {
    //common: { "Authorization": 'Bearer ' },
    //post: { 'Content-Type': 'application/json' }
  }
});

/**
 * Gets time blocks from the endpoint
 * @returns Promise with the time blocks
 */
export const getTimeBlocks = async (): Promise<TimeBlock[]> => {
  try {
    const response = await api.get('/blocks');
    return response.data;
  } catch (error) {
    console.error('Error getting time blocks:', error);
    return [];
  }
};

/**
 * Gets paginated users from the endpoint
 * @param {number} page - Page number
 * @param {number} limit - Users limit per page
 * @returns Promise with paginated users
 */
export const getUsers = async (page: number = 1, limit: number = 10): Promise<User[]> => {
  try {
    const response = await api.get(`/users?page=${page}&limit=${limit}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

/**
 * Gets users with reservations from the endpoint
 * @param {string} filter - Search filter
 * @param {string[]} selectedFields - Selected fields
 * @param {number} page - Page number
 * @param {number} limit - Users limit per page
 * @param {string} date - Date in YYYY-MM-DD format, defaults to current date
 * @returns Promise with users who have reservations
 */
export const getUsersWithReservations = async (
  filter: string = '',
  selectedFields: string[] = [],
  page: number = 1,
  limit: number = 10,
  date: string = getCurrentDate()
): Promise<User[]> => {
  try {
    const params: { filterValue: string; tags?: string[], page?: number, limit?: number, startTime?: string, date?: string } = {
      filterValue: filter
    };

    if (selectedFields.length > 0) {
      params.tags = selectedFields;
    }

    params.page = page;
    params.limit = limit;
    params.startTime = date || getCurrentDate();

    const response = await api.post('/users/v0/with-reservations', params);
    if (!response.status) {
      throw new Error('Error getting users with reservations');
    }

    let users: User[] = [];
    if (response.data && response.data.data.length > 0) {
      response.data.data.forEach((element: any) => {
        element.attachedUser.style = element.style;
        users.push(element.attachedUser);
      });
    }
    return users;
  } catch (error) {
    console.error('Error in getUsersWithReservations:', error);
    return [];
  }
};

/**
 * Gets time blocks for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns Promise with time blocks for the specified date
 */
export const getTimeBlocksByDate = async (date: string): Promise<TimeBlock[]> => {
  try {
    const response = await api.get(`/blocks/by-date?date=${date}&limit=24&page=1`);
    if (response.data.data.length > 0) {
      console.log('response.data.data:', response.data.data);
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error getting time blocks for date ${date}:`, error);
    return [];
  }
};

/**
 * Creates a new user in the system
 * @param {CreateUserData} userData - User data to create
 * @returns Promise with the operation result
 */
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Creates a new time block in the system
 * @param {CreateBlockData} blockData - Block data to create
 * @returns Promise with the operation result
 */
export const createBlock = async (blockData: CreateBlockData): Promise<TimeBlock> => {
  try {
    console.log('blockData:', blockData);
    const response = await api.post('/blocks', blockData);
    return response.data;
  } catch (error) {
    console.error('Error creating time block:', error);
    throw error;
  }
};