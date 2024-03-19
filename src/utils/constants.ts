import { toast, Bounce } from 'react-toastify';

export const MAX_FILE_SIZE = 1024000000;

export const validFileExtensions: Record<string, string[]> = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'svg+xml', 'webp', 'jfif'],
  video: ['mp4', 'mov', 'avi', 'wmv', 'flv', '3gp', 'mkv', 'webm'],
  audio: ['mp3', 'wav', 'ogg', 'wma', 'flac', 'aac','mpeg'],
  others: ['pdf', 'docx', 'obj'],
  application: ['pdf','docx'],
  threedimension: ['glb'],
};

const toastSetting: any = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  transition: Bounce,
};

export const toastSuccessMessage = (message: string) => {
  toast.success(message,toastSetting);
};

export const toastErrorMessage = (message: string) => {
  toast.error(message,toastSetting);
};