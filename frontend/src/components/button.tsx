
import type { SubSidebarProps } from '../types/props';

type ButtonProps = SubSidebarProps & {
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
};

export function Button(props: ButtonProps) {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className='flex items-center gap-1 bg-[#438989] rounded-md py-1.5 sm:pl-3 px-1 text-white sm:pr-3 hover:cursor-pointer'
    >
      {props.icon && <props.icon className='w-6' />}
      {props.title}
    </button>
  );
}
