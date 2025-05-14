
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useToast as useShadcnToast } from "@/components/ui/toaster";

export type { ToastProps, ToastActionElement };

export const useToast = useShadcnToast;

type ToastFunction = (props: ToastProps) => void;

export const toast: ToastFunction = (props) => {
  const { toast } = useShadcnToast();
  toast(props);
};
