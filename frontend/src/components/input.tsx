
import type { InputProps } from "../types/props";

export function InputBox(props: InputProps) {
  return (
    <div className="bg-white mx-4 px-2 py-1.5 rounded-md border border-[#438989]">
      <input 
        className="w-full outline-none px-0.5"
        type={props.type}
        name={props.name} 
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}
