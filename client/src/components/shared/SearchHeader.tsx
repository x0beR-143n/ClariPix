'use client'
import Link from "next/link"
import Image from "next/image"
import { useState } from 'react'
import { ChevronDown, Search } from "lucide-react"
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import SignUpButton from "../auth/SignUpButton"
import FavoritesModal from "../auth/FavoritesModal"
import LoginButton from "../auth/LoginButton"
import { useAuthStore } from "@/src/store/authStore"
import { toast } from "sonner"
import { useUsernameFormatter } from "@/src/libs/tousername"
import { setPreferences } from "@/src/api/user"

const male_url = '/img/man.png'

export default function SearchHeader() {
  const isLogin = useAuthStore(s => s.isLogin)
  const user    = useAuthStore(s => s.user)
  const logout  = useAuthStore(s => s.logout)

  const { toUsername } = useUsernameFormatter();

  const router = useRouter()
  const [openFav, setOpenFav] = useState(false)
  const handleLogout = () => { 
    logout(); 
    toast.success("Logout successfully")
    router.push('/') 
  }

  return (
    <>
    <div className="w-full flex items-center gap-x-8">
      <InputGroup className="flex-1 h-12 shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0">
        <InputGroupInput placeholder="Find your favourite image..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {isLogin ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="
                group
                flex items-center gap-x-2 rounded-full px-1.5 py-1
                hover:bg-zinc-100 transition
                cursor-pointer select-none
                data-[state=open]:bg-zinc-200
              "
            >
              <span className="relative w-10 h-10">
                {user?.avatar_url ? (
                    <Image
                      src={user?.avatar_url}
                      alt="Avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src={male_url}
                      alt="Avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  )}
              </span>
              <ChevronDown
                size={20}
                strokeWidth={1.25}
                className="
                  transition-transform duration-200
                  group-data-[state=open]:rotate-180
                "
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8">
                  {user?.avatar_url ? (
                    <Image
                      src={user?.avatar_url}
                      alt="Avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src={male_url}
                      alt="Avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{user?.name ? user.name : "User Name"}</span>
                  <span className="text-xs text-zinc-500">@{toUsername(user?.name ? user.name : "User Name", user?.birthdate ? user.birthdate : '2004')}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild><Link href="/profile">View Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/create">Upload Image</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/profile">My Collections</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/profile">Favorites</Link></DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">Help & Support</Link></DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-3">
          <LoginButton />
          <SignUpButton onSignedUp={() => setOpenFav(true)} />
        </div>
      )}
    </div>
    <FavoritesModal
      open={openFav}
      onClose={() => setOpenFav(false)}
      onSave={async (prefs) => {
        await setPreferences(prefs)
        toast.success('Preferences saved')
        setOpenFav(false)
      }}
    />
    </>
  )
}
