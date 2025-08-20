import { toast } from "react-toastify";

export function notifyAndRedirect(message, navigate, to = "/login", delay = 1500) {
    toast.error(message);
    setTimeout(() => {
        navigate(to);
    }, delay);
}