"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { SidebarMenuButton } from "@/components/ui/sidebar";
import { UserRound } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useUser } from "@/context/auth-context";
import { NotificationDropdown } from "./navigationDropDown";

export default function HeaderDropdown() {
  const { user } = useUser();

  return (
    <div className="flex w-full justify-between items-center">
      <h4 className="text-primary-gray text-[17px] font-[family-name:var(--font-dm)] font-semibold capitalize">
        Electronic Document Management System
      </h4>
      <div className="flex justify-end items-center gap-[16px]">
        <NotificationDropdown />
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="cursor-pointer hover:bg-white focus-visible:ring-0"
          >
            <SidebarMenuButton className="">
              <div className="flex justify-center items-center h-[24px] w-[24px] bg-[#F5FAFF] rounded-full">
                <UserRound className="text-[#04B2F1] w-[12px] h-[12px]" />
              </div>
              <span className="font-[family-name:var(--font-poppins)] text-[#3A3A3A]">
                {user?.email}
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
