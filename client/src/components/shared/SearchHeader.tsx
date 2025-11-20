'use client'
import Link from "next/link"
import Image from "next/image"
import { useState, KeyboardEvent, useRef } from 'react'
import { ChevronDown, Search } from "lucide-react"
import { useRouter, usePathname } from 'next/navigation'
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

interface SearchHeaderProps {
  text?: string;
}

export default function SearchHeader({ text }: SearchHeaderProps) {
  const isLogin = useAuthStore(s => s.isLogin)
  const user    = useAuthStore(s => s.user)
  const logout  = useAuthStore(s => s.logout)

  const { toUsername } = useUsernameFormatter();

  const router = useRouter()
  const pathname = usePathname()

  const [openFav, setOpenFav] = useState(false)

  // ref để đọc value của input khi search
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleLogout = () => { 
    logout(); 
    toast.success("Logout successfully")
    router.push('/') 
  }

  const doSearch = () => {
    const q = inputRef.current?.value?.trim() ?? ""

    if (!q) {
      router.push(pathname)            // clear search param -> load all
      return
    }

    router.push(`${pathname}?search=${encodeURIComponent(q)}`)
  }

  const onEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") doSearch()
  }

  return (
    <>
      <div className="w-full flex items-center gap-x-8">
        {/* SEARCH INPUT */}
        <InputGroup className="flex-1 h-12 shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0">
          <InputGroupInput
            key={text ?? ""}                            // remount khi search param đổi
            ref={inputRef}
            defaultValue={text ?? ""}                   // sync với ?search=...
            onKeyDown={onEnter}
            placeholder="Find your favourite image..."
          />

          <InputGroupAddon
            onClick={doSearch}
            className="cursor-pointer"
          >
            <Search />
          </InputGroupAddon>
        </InputGroup>

        {/* PHẦN LOGIN / DROPDOWN GIỮ NGUYÊN */}
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
                <div className="relative w-10 h-10">
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-zinc-400 bg-zinc-200 rounded-full">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
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
                    <Image
                      src={user?.avatar_url || male_url}
                      alt="Avatar"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{user?.name || "User Name"}</span>
                    <span className="text-xs text-zinc-500">
                      @{toUsername(user?.name || "User Name", user?.birthdate || "2004")}
                    </span>
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

              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
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
