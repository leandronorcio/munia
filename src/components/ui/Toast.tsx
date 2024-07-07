import type { AriaToastProps } from '@react-aria/toast';
import { useToast } from '@react-aria/toast';
import { QueuedToast, ToastState } from '@react-stately/toast';
import { useRef, SVGProps } from 'react';
import {
  Close,
  CircleActionsAlertInfo,
  CircleActionsClose,
  CircleActionsSuccess,
  NotificationBell,
} from '@/svg_components';
import { cn } from '@/lib/cn';
import { ToastType, toastColors } from '@/lib/toast';
import Button from './Button';

export const toastIcons = {
  default: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <NotificationBell {...props} />,
  },
  success: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <CircleActionsSuccess {...props} />,
  },
  warning: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <CircleActionsAlertInfo {...props} />,
  },
  error: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => <CircleActionsClose {...props} />,
  },
};

interface ToastProps<T> extends AriaToastProps<T> {
  state: ToastState<T>;
  toast: QueuedToast<T>;
}

export function Toast<T extends ToastType>({ state, ...props }: ToastProps<T>) {
  const ref = useRef(null);
  const { toastProps, titleProps, descriptionProps, closeButtonProps } = useToast(props, state, ref);

  const { title, message, type = 'default' } = props.toast.content;

  return (
    <div
      {...toastProps}
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border p-6',
        toastColors[type].bg,
        toastColors[type].border,
      )}>
      <div>
        <div className="flex items-center gap-4">
          {toastIcons[type].renderComponent({
            width: 24,
            height: 24,
            className: toastColors[type].icon,
          })}
          <h4 {...titleProps} className={cn('text-lg font-semibold', toastColors[type].text)}>
            {title}
          </h4>
        </div>
        {message !== undefined && message !== '' && (
          <p {...descriptionProps} className={cn('ml-10 text-sm', toastColors[type].text)}>
            {message}
          </p>
        )}
      </div>
      <Button {...closeButtonProps} mode="ghost" size="small" Icon={Close} iconClassName={toastColors[type].icon} />
    </div>
  );
}
