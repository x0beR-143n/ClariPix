
import { axiosBase } from './api'
import { ImageMetadata } from '../interfaces/images'
import axios from 'axios';

export const getAllImages = async (page: number, limit: number ) : Promise<ImageMetadata[]> => {
  try {
    const data = await axiosBase.get(`/images?page=${page}&limit=${limit}`);
    const isSuccess = data.status;
    if(isSuccess) {
        console.log(data.data.data);
        return data.data.data;
    } else {
        return [];
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (!err.response) {
        throw { code: 'NETWORK', message: 'Network Error' }
      }
      throw {
        code: 'ServerError',
        message: 'Temporarily can not get images. Please try again later',
      } 
    }
    throw { code: 'NETWORK', message: 'Network Error' } 
  }
}

