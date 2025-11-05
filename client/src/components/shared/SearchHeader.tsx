'use client'
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import LoginModal from "../LoginModal"
import SignUpModal from "../SignUpModal"

const ava_url = "/img/ava_main.jpg"
const isLogin = false

export default function SearchHeader() {
  return (
    <div className="w-full flex items-center gap-x-8">
      <InputGroup className="w-8/10 h-12 shadow-none has-[[data-slot=input-group-control]:focus-visible]:ring-0">
        <InputGroupInput placeholder="Find your favourite image..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {isLogin ? (
        <DropdownMenu>
          {/* Trigger */}
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
                <Image
                  src={ava_url}
                  alt="Avatar"
                  fill
                  priority
                  className="rounded-full object-cover"
                />
              </span>
              {/* icon xoay theo group state */}
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
                    src={ava_url}
                    alt="Avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">Your Name</span>
                  <span className="text-xs text-zinc-500">@username</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild><Link href="/profile">View Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/create">Upload Image</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/collections">My Collections</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/favorites">Favorites</Link></DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/help">Help & Support</Link></DropdownMenuItem>

            <DropdownMenuItem className="justify-between">
              <span>Keyboard Shortcuts</span>
              <kbd className="pointer-events-none inline-flex h-5 items-center gap-1 rounded bg-zinc-100 px-1.5 text-[10px] font-medium text-zinc-600">
                ?
              </kbd>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600 focus:text-red-600">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          
          <LoginModal open={false} onClose={() => {

          }} />
          <SignUpModal open={false} onClose={() => {
            
          }} />
        </div>
   
      )}
    </div>
  )
}
