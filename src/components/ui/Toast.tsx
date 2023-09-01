import type { AriaToastProps } from '@react-aria/toast';
import { useToast } from '@react-aria/toast';
import { QueuedToast, ToastState } from '@react-stately/toast';
import { SVGProps, useRef } from 'react';
import Button from './Button';
import { ToastType } from '@/contexts/ToastContext';
import {
  CircleActionsAlertInfo,
  CircleActionsClose,
  CircleActionsSuccess,
  Close,
  NotificationBell,
} from '@/svg_components';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

interface ToastProps<T> extends AriaToastProps<T> {
  state: ToastState<T>;
  toast: QueuedToast<T>;
}

export function Toast<T extends ToastType>({ state, ...props }: ToastProps<T>) {
  let ref = useRef(null);
  let { toastProps, titleProps, descriptionProps, closeButtonProps } = useToast(
    props,
    state,
    ref,
  );

  const { title, message, type = 'default' } = props.toast.content;

  return (
    <div
      {...toastProps}
      ref={ref}
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl p-6',
        colors[type].bg,
      )}
    >
      <div>
        <div className="flex items-center gap-4">
          {icons[type].renderComponent({
            width: 24,
            height: 24,
            className: colors[type].icon,
          })}
          <h4
            {...titleProps}
            className={cn('text-lg font-semibold', colors[type].text)}
          >
            {title}
          </h4>
        </div>
        {message !== undefined && message !== '' && (
          <p
            {...descriptionProps}
            className={cn('ml-10 text-sm text-gray-700', colors[type].text)}
          >
            {message}
          </p>
        )}
      </div>
      <Button
        {...closeButtonProps}
        mode="ghost"
        size="small"
        Icon={(props) => (
          <Close className={cn(props.className, colors[type].icon)} />
        )}
      />
    </div>
  );
}

const colors = {
  default: {
    bg: 'bg-violet-200',
    text: 'text-violet-700',
    icon: 'stroke-violet-700',
  },
  success: {
    bg: 'bg-green-200',
    text: 'text-green-700',
    icon: 'stroke-green-700',
  },
  warning: {
    bg: 'bg-yellow-200',
    text: 'text-yellow-700',
    icon: 'stroke-yellow-700',
  },
  error: {
    bg: 'bg-pink-200',
    text: 'text-red-700',
    icon: 'stroke-red-700',
  },
};

const icons = {
  default: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <NotificationBell {...props} />
    ),
  },
  success: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <CircleActionsSuccess {...props} />
    ),
  },
  warning: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <CircleActionsAlertInfo {...props} />
    ),
  },
  error: {
    renderComponent: (props?: SVGProps<SVGSVGElement>) => (
      <CircleActionsClose {...props} />
    ),
  },
};
