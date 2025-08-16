
import type { InputProps } from "../types/props";

export function InputBox(props: InputProps) {
  return (
    <div className="bg-white sm:mx-4 mx-2 sm:px-2 px-1 py-1.5 rounded-md border border-[#438989]">
      <input 
        className="w-full outline-none sm:px-0.5 px-1"
        type={props.type}
        name={props.name} 
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}
