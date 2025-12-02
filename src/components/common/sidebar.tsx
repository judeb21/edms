"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar";
// import { AppDispatch } from "@/store";
// import { useIsMobile } from "@/hooks/use-mobile";
import { superAdminLinks } from "@/utils/route";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import { useUser } from "@/context/auth-context";
// import { useDispatch } from "react-redux";

export default function AppSidebar() {
  //   const router = useRouter();
  const pathname = usePathname();

  const { logout } = useUser();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="my-[20px] px-[22px]">
          <Link href="/overview">
            <Image
              src="/logo-text.svg"
              className="max-w-[150px] max-h-[40px]"
              alt="Credlanche login"
              width={150}
              height={40}
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-[22px] border-t-1 border-b-1 border-[#EAEAEA]">
        <SidebarGroup className="py-[20px] px-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 mt-[20px]">
              {superAdminLinks.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`relative flex items-center font-[family-name:var(--font-dm)] hover:font-[family-name:var(--font-dm)] py-[20px] px-[14px] text-[#04B2F1] rounded-none ${
                        (pathname === item.url ||
                          pathname.includes(item.url)) &&
                        "hover:font-[family-name:var(--font-dm)] !text-white bg-brand-blue hover:!bg-brand-blue"
                      }`}
                    >
                      <item.icon
                        className={`${
                          pathname === item.url || pathname.includes(item.url)
                            ? "text-[#FFFFFF]"
                            : "text-[#04B2F1]"
                        }`}
                      />
                      <span className="text-[13px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-[30px] px-0 border-t-1 border-[#EAEAEA]">
          <SidebarGroupLabel className="font-[family-name:var(--font-poppins)] uppercase text-[#04B2F1] font-[600]">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 mt-[20px]">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/settings"
                    className={`relative flex items-center font-[family-name:var(--font-poppins)] hover:font-[family-name:var(--font-poppins)] py-[20px] px-[14px] text-[#04B2F1] rounded-none ${
                      (pathname === "/settings" ||
                        pathname === "/settings/workflow") &&
                      "hover:font-[family-name:var(--font-poppins)] !text-[#ffffff] bg-[#0284B2] hover:!bg-[#0284B2]"
                    }`}
                  >
                    <Settings
                      className={`${
                        pathname === "/settings" || pathname === "/settings"
                          ? "text-[#FFFFFF]"
                          : "text-[#04B2F1]"
                      }`}
                    />
                    <span className="text-[13px]">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    type="button"
                    className={`cursor-pointer relative flex items-center font-[family-name:var(--font-poppins)] hover:font-[family-name:var(--font-poppins)] py-[20px] px-[14px] text-[#04B2F1] rounded-none ${
                      pathname === "/logout" &&
                      "hover:font-[family-name:var(--font-poppins)] !text-[#ffffff] bg-[#0284B2] hover:!bg-[#0284B2]"
                    }`}
                    onClick={logout}
                  >
                    <LogOut className={"text-[#FC5A5A]"} />
                    <span className="text-[13px] text-[#FC5A5A] ml-2">
                      Logout
                    </span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
