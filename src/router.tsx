import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    // SPA сама не сбрасывает скролл документа при pushState-переходе: уйдя
    // из проскролленного меню на /shop (или с /shop на /bestiary), человек
    // оставался бы на той же высоте страницы. Включаем восстановление
    // скролла роутера: новая навигация начинается сверху, назад/вперёд
    // возвращает прежнюю позицию.
    scrollRestoration: true,
  });
}
