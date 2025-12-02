import "@/app/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DM_Sans, Poppins } from "next/font/google";
import { CSSProperties } from "react";
import AppSidebar from "@/components/common/sidebar";
import HeaderDropdown from "@/components/common/header";

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang="en">
      <div
        className={`min-h-screen min-h-[100vh] grid grid-cols-1 ${dmSans.variable} ${poppins.variable} antialiased vsc-initialized`}
      >
        <SidebarProvider
          style={
            {
              "--sidebar-width": "260px",
            } as CSSProperties
          }
        >
          <AppSidebar />
          <main className="w-full overflow-hidden">
            <div
              className={`${dmSans.variable} ${poppins.variable} antialiased vsc-initialized`}
            >
              <div className="relative">
                {/* Header */}
                <div className="w-full flex pb-[18px] px-[1rem] md:px-[2rem] my-[22px] justify-between items-center shadow_[0_-1px_0px_0px_rgba(230,230,230,1)] border-b border-[#E7E7E7]">
                  <SidebarTrigger className="mr-1" />
                  <div className="w-full flex items-center">
                    <HeaderDropdown />
                  </div>
                </div>

                <div className="bg-white">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </div>
    </main>
  );
}
