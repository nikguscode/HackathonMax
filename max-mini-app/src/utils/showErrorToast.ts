import toast from 'react-hot-toast';

export const showErrorToast = (error: any) => {
  const status = error?.response?.status;

  let message = 'Не удалось загрузить данные';

  if (status === 401) {
    message = 'Ошибка авторизации';
  } else if (status === 404) {
    message = 'Ресурс не найден';
  } else if (status === 500) {
    message = 'Внутренняя ошибка сервиса';
  }

  toast.error(message);
};