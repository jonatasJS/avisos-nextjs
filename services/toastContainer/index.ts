import { toast } from "react-toastify";

export default function toastContainer(message: string, type: 'info' | 'success' | 'warning' | 'error' | 'default') {
  toast(message, {
    type: type,
    theme: 'dark',
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    pauseOnFocusLoss: false,
  });
}