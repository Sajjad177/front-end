import { ReactNode } from "react";

export interface ChildrenProps {
  children: ReactNode;
}

export interface ClassNameProps {
  className?: string;
}

export type SidebarItem = {
  title: string;
  href: string;
  icon?: string;
  roles?: string[];
  disabled?: boolean;
};
