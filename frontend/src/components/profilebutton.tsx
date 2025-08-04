
import * as Icon from '../icons';
import type { NavbarProps } from '../types/props';

export function ProfileBar (
    props: NavbarProps
) {
    return (
        <div className='flex items-center justify-center gap-3 border bg-[#438989] rounded-md text-white py-2 px-3.5 '>
            <img 
                src={props.image}
                className='w-10 rounded-4xl border'
            />
            <div>
                <Icon.DownIcon className='w-4'/>
            </div>
        </div>
    )
}