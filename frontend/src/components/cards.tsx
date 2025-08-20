import * as Icon from "../icons";
import type { CardProps } from "../types/props";

export function Cards(props: CardProps) {
    
    const tagArray : string[] = 
        typeof props.tags === "string" 
        ? props.tags.split(/[\s,]+/).filter(Boolean)
        : Array.isArray(props.tags)
        ? props.tags
        : [];
    console.log(tagArray);
    return (
        <div className='bg-white rounded-md drop-shadow-2xl sm:max-w-89 max-w-100 h-fit min-w-50'>
            <div className='flex justify-between items-center px-2 pt-3'>
            <div className='font-medium text-sm bg-[#438989] max-h-8 px-3 py-2 flex items-center justify-center rounded-md text-white gap-1'>
                {props.title}
            </div>
            <button 
                onClick={props.onDelete}
                className='bg-[#438989] w-8 h-8 flex items-center justify-center rounded-md'
            >
                <Icon.DeleteIcon className='w-5 text-white'/>
            </button>
            </div>
            <div className='p-2 flex justify-center items-center'>
                {props.previewhtml ? (
                    <div
                        className="w-full"
                        dangerouslySetInnerHTML={{ __html: props.previewhtml }}
                    />
                    ) : (
                    <div className="text-gray-500 text-sm italic">No preview available</div>
                    )}
            </div>
            <div className='p-2 flex gap-2 flex-wrap'>
                {tagArray.map((tag, index) => (
                    <div key={index} className='rounded-xl bg-[#daedeb] px-3 py-1 text-xs text-gray-700'>
                        #{tag}
                    </div>
                ))}
            </div>
            <div className='p-2 text-xs mb-1'>
                created date
            </div>
        </div>
    )
}