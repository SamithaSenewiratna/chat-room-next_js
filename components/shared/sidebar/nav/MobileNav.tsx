"use client";

import { Card } from "@/components/ui/card";
import { useNavigation } from "@/hook/useNavigation";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const paths = useNavigation();

  return (
    <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
      <nav className="w-full">
        <ul className="flex justify-evenly items-center">
          {paths.map((path, id) => (
            <li key={id} className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    size="icon"
                    variant={path.active ? "default" : "outline"}
                  >
                    <Link href={path.href}>{path.icon}</Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{path.name}</p>
                </TooltipContent>
              </Tooltip>
            </li>
          ))}
          <li className="flex flex-col items-center gap-4">
            <UserButton />
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
