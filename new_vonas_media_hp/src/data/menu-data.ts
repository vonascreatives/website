import { IMenuDT } from "@/types/menu-d-t";


const menu_data:IMenuDT[] = [
  {
    id: 1,
    title: 'Home',
    link: '/',
  },
  {
    id: 2,
    title: 'About',
    link: '/about',
  },
  {
    id: 3,
    title: 'Channels',
    link: '/channels',
  },
  {
    id: 4,
    title: 'Creators',
    link: '/creators',
  },
  {
    id: 5,
    title: 'FAQ',
    link: '/faq',
  }
];



export default menu_data;

// mobile menus 
export const mobile_menu_data:{
  id: number;
  title: string;
  link: string;
  dropdown_menus: {
      title: string;
      link: string;
  }[];
}[] = [
  {
    id: 1,
    title: 'Home',
    link: '/',
    dropdown_menus: []
  },
  {
    id: 2,
    title: 'About',
    link: '/about',
    dropdown_menus: []
  },
  {
    id: 3,
    title: 'Channels',
    link: '/channels',
    dropdown_menus: []
  },
  {
    id: 4,
    title: 'Creators',
    link: '/creators',
    dropdown_menus: []
  },
  {
    id: 5,
    title: 'FAQ',
    link: '/faq',
    dropdown_menus: []
  }
]
