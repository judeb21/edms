import "@/app/globals.css";
import { DM_Sans, Poppins } from "next/font/google";

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
        className={`min-h-screen min-h-[100vh] grid grid-cols-1 ${dmSans.variable} ${poppins.variable}`}
      >
        <main className="w-full overflow-hidden">
          <div
            className={`${dmSans.variable} ${poppins.variable} antialiased vsc-initialized`}
          >
            <div className="relative">{children}</div>
          </div>
        </main>
      </div>
    </main>
  );
}
