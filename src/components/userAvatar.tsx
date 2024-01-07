import {
    Avatar,
    AvatarFallback,
  } from "@/components/ui/avatar"
  
  const UserAvatar = () => {
    return (
      <Avatar>
        <AvatarFallback>
          <i className="fa-solid fa-user"></i>
        </AvatarFallback>
      </Avatar>
    )
  }
  
  export default UserAvatar