import { Button } from "./button"
import * as Icon from '../icons'
import type { NavbarProps } from "../types/props"
import { ProfileDropdown } from "./profiledropdown";

interface ExtendedNavbarProps extends NavbarProps {
  onAddClick: () => void;
  onLogout: () => void;
}

export function Navbar({ title, image, onAddClick, onLogout}: ExtendedNavbarProps) {
  return (
    <div className="fixed top-0 right-0 w-full z-100">
      <div className='sm:flex hidden justify-between items-center p-4 lg:ml-60 sm:ml-14 sm:border-b-2 sm:border-white bg-[#daedeb]'>
        <div className='sm:block hidden text-2xl font-semibold'>
          Welcome {title}
        </div>
        <div className='sm:flex hidden gap-5 items-center'>
          <div>
            <Button icon={Icon.AddIcon} title='Add' onClick={onAddClick} />
          </div>
          <div>
            <ProfileDropdown image={image} onLogout={onLogout}/>
          </div>
        </div>
      </div>
    </div>
  )
}
