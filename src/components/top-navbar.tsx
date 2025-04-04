import { Settings, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Mock user data - in a real app, this would come from authentication
const currentUser = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
};

export function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Link href="/" className="flex items-center">
            <PaloLogo className="h-8 w-auto" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="mr-2">
            <Button variant="ghost" size="icon">
              <Trophy className="h-5 w-5" />
              <span className="sr-only">Ranking</span>
            </Button>
          </Link>
          <Link href="/settings" className="mr-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </Link>

          <div className="mr-2">
            <ThemeToggle />
          </div>

          <div className="flex">
            <Link
              href={`/u/${currentUser.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="mr-2"
            >
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// PALO Logo component using the SVG from the source
function PaloLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/palo-logo.svg"
      alt="PALO Logo"
      width={137}
      height={32}
      className={className}
      priority // Add priority since this is likely above the fold
    />
  );
}
