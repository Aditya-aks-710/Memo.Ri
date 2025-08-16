import { useState } from 'react';
import * as Icon from '../icons';
import type { SubSidebarProps } from '../types/props';
import { Button } from './button';
import { ProfileDropdown } from './profiledropdown';

interface SidebarProps{
    image?: string;
    onAddClick : () => void;
    onLogout: () => void;
}

export function Sidebar({ image, onAddClick, onLogout} : SidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className='sm:h-screen lg:w-60 w-full bg-[#D9D9D9] sm:block flex flex-col justify-between border border-gray-200 drop-shadow-xl sm:transition-[width] duration-300 ease-in-out'>
            <div className='size-full flex sm:flex-col flex-row sm:justify-start justify-between sm:items-stretch items-center'>    
                <div className='mx-2 sm:flex justify-between items-center block my-3'>
                    <div className='lg:flex sm:hidden flex items-center bg-[#438989] pl-2 py-1 pr-3 rounded-md gap-1'>
                        <Icon.LogoIcon className='w-8 rotate-45'/>
                        <div className='text-xl text-white'>
                        Memo.<span className='text-black'>Ri</span>
                        </div>
                    </div>
                    <div className='p-2 sm:block hidden'>
                        <Icon.CloseIcon className='w-6 fill-[#438989]'/>
                    </div>
                </div>
                <div className='sm:block hidden'>
                    <SubSidebar icon={Icon.HomeIcon} title="Home"/>
                    <SubSidebar icon={Icon.ImageIcon} title="Images"/>
                    <SubSidebar icon={Icon.YoutubeIcon} title="Videos"/>
                    <SubSidebar icon={Icon.ArticleIcon} title="Articles"/>
                    <SubSidebar icon={Icon.PdfIcon} title="Documents"/>
                </div>
                <div className='sm:hidden flex flex-1 items-center justify-between mr-2 gap-2'>
                    <div
                        onClick={() => setOpen(!open)}
                        className='flex items-center justify-center bg-[#438989] rounded-md p-1 my-3'>
                        {!open &&<Icon.HamburgerIcon className='w-7 fill-white'/>}
                        {open && <Icon.CloseIcon className='w-7 fill-white'/>}
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button icon={Icon.AddIcon} title='Add' onClick={onAddClick}/>
                        <ProfileDropdown image={image} onLogout={onLogout}/>
                    </div>
                </div>
            </div>
            {open && <div className='sm:hidden block mx-2'>
                <SubSidebar icon={Icon.HomeIcon} title="Home"/>
                <SubSidebar icon={Icon.ImageIcon} title="Images"/>
                <SubSidebar icon={Icon.YoutubeIcon} title="Videos"/>
                <SubSidebar icon={Icon.ArticleIcon} title="Articles"/>
                <SubSidebar icon={Icon.PdfIcon} title="Documents"/>
            </div>}
        </div>
    )
}

function SubSidebar(props : SubSidebarProps){
    return (
        <div className='sm:m-2 sm:my-3 mx-1 my-1'>
            <div className='group flex items-center justify-between bg-[#daedeb] lg:px-4 lg:py-2 py-2 px-1.5 rounded-lg sm:gap-1 border border-[#438989] hover:bg-[#438989] hover:text-[#daedeb]'>
                {props.icon && <props.icon className='w-5.5 fill-current'/>}
                <div className='lg:block sm:hidden block text-sm font-medium text-[#102223] group-hover:text-[#daedeb]'>
                {props.title}
                </div>
            </div>
        </div>
    )
}