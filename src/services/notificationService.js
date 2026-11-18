import { toast } from 'react-toastify';

export const notificationService = {
  success: (message, options = {}) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
      ...options
    });
  },
  
  info: (message, options = {}) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 2000,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
      ...options
    });
  },

  error: (message, options = {}) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
      ...options
    });
  },

  warning: (message, options = {}) => {
    toast.warning(message, {
      position: "top-right",
      autoClose: 3000,
      className: "custom-toast",
      bodyClassName: "custom-toast-body",
      ...options
    });
  }
};

export default notificationService;
