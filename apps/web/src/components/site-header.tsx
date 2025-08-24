"use client";

import LogoWithText from "@/logo-with-text.svg";
import { Link } from "@tanstack/react-router";
import { SearchInput } from "./search";
import {DynamicWidget} from "@/lib/dynamic"

export function SiteHeader() {
  return (
    <header className="w-full border-b-[0.4px] shadow-dialog bg-background">
      <div className="flex items-center justify-between mx-auto h-[54px] max-w-7xl px-4">
        <div className="flex items-center gap-10">
          <Link to={"/"}>
            <img height={40} src={LogoWithText} alt="Inflection Logo" />
          </Link>
          {/* <div className="hidden lg:block">
          <MainNav />
        </div> */}
        </div>
        <div className="flex items-center gap-4">
          <SearchInput />
            <DynamicWidget />
        </div>
      </div>
    </header>
  );
}