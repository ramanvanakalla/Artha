import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import UserAvatar from "./userAvatar"

const Profile = () => {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="nothing">
                <UserAvatar></UserAvatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-36 mx-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Log out
                </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Profile