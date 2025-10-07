import React from "react";
import Link from "next/link";
import { mobile_menu_data } from "@/data/menu-data";

export default function MobileMenusTwo() {
  const [navTitle, setNavTitle] = React.useState<string>("");

  //openMobileMenu
  const openMobileMenu = (menu: string) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };
  return (
    <nav className="tp-main-menu-content">
      <ul>
        {mobile_menu_data.map((menu) => (
          <li key={menu.id}>
            <Link href={menu.link}>
              {menu.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
