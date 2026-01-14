"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getToken, clearToken } from "@/lib/auth";
import { useState } from "react";
import BouncyClick from "@/components/ui/bouncy-click";
import { motion, AnimatePresence } from "framer-motion";
import {
  retract,
  normalize,
  transition_fast,
  transition,
  fade_out,
} from "@/lib/transitions";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

function NavLink({
  href,
  label,
  isMobile,
}: {
  href: string;
  label: string;
  isMobile?: boolean;
}) {
  // active currently unused; styling can be added later
  return (
    <BouncyClick>
      <Button
        className={`${isMobile ? "w-full justify-start" : ""}`}
        asChild
        variant="ghost"
      >
        <Link href={href}>{label}</Link>
      </Button>
    </BouncyClick>
  );
}

export function Navbar() {
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // searchParams changes will re-render this component; derive logged-in state from token.
  const loggedIn = !!getToken();

  void searchParams;

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <BouncyClick noRipple>
              <Link href="/" className="text-xl font-bold">
                EasyStream
              </Link>
            </BouncyClick>
            <NavLink href="/browse-live" label="Live Now" />
            <NavLink href="/browse-past" label="Past Streams" />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <BouncyClick noRipple>
              <Link href="/" className="text-xl font-bold">
                EasyStream
              </Link>
            </BouncyClick>
          </div>

          {/* Right side - Login/User Avatar (unchanged) */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <BouncyClick>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </BouncyClick>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={String(loggedIn)}
                initial={fade_out}
                animate={normalize}
                exit={fade_out}
                transition={transition}
              >
                <BouncyClick>
                  {loggedIn && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        clearToken();
                      }}
                    >
                      Logout
                    </Button>
                  )}
                </BouncyClick>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <AnimatePresence mode="wait">
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={retract}
              animate={{
                ...normalize,
                height: "auto",
              }}
              exit={retract}
              transition={transition_fast}
              className="md:hidden border-t bg-background overflow-hidden"
              key={mobileMenuOpen ? "open" : "closed"}
            >
              <div className="px-4 py-2 space-y-1">
                <NavLink href="/browse-live" label="Live Now" isMobile />
                <NavLink href="/browse-past" label="Past Streams" isMobile />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
