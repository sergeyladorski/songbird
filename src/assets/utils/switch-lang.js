import { menuData } from "./menu-data";

export function switchLang() {
  if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', 'en');
  } else if (localStorage.getItem('lang') === 'en') {
    localStorage.setItem('lang', 'ru');
  } else {
    localStorage.setItem('lang', 'en');
  }
};

export function translateNav() {
  const lang = localStorage.getItem('lang') || 'en';
  const navLinkList = document.querySelectorAll('.nav__link');

  navLinkList.forEach(item => {
    item.textContent = menuData[Array.from(navLinkList).indexOf(item)][lang];
  })
};