import Swal, { type SweetAlertOptions } from "sweetalert2";

type AlertOptions = Pick<SweetAlertOptions, "icon" | "title" | "text" | "html">;

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  showCloseButton: true,
  timer: 3500,
  timerProgressBar: true,
  customClass: {
    popup: "hs-toast",
    title: "hs-toast-title",
    htmlContainer: "hs-toast-text",
    icon: "hs-toast-icon",
    closeButton: "hs-toast-close",
    timerProgressBar: "hs-toast-progress",
  },
});

export function showAlert(options: AlertOptions) {
  return toast.fire(options);
}
