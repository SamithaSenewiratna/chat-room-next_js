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

const DesktopNav = () => {
  const paths = useNavigation();

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav>
        <ul className="flex flex-col items-center gap-4">
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
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-4">
        <UserButton />
      </div>
    </Card>
  );
};

export default DesktopNav;
