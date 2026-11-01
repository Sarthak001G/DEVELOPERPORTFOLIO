/**
 * router.js — Hash-based navigation router
 * Maps hash fragments to page activations within the sidebar.
 * In React migration: replace with React Router <Routes>.
 */

const Router = {
  routes: {},
  currentRoute: null,

  define(routes) {
    Router.routes = routes;
  },

  navigate(path, pushState = true) {
    if (pushState) {
      window.location.hash = path;
    }
    Router._resolve(path);
  },

  _resolve(path) {
    const route = Router.routes[path] || Router.routes['*'];
    if (!route) return;
    if (Router.currentRoute) Router.currentRoute.leave?.();
    Router.currentRoute = route;
    route.enter?.();

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.route === path);
    });
  },

  init() {
    window.addEventListener('hashchange', () => {
      Router._resolve(window.location.hash.slice(1) || '/');
    });

    // Attach click listeners on nav items
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        Router.navigate(el.dataset.route);
      });
    });

    // Initial resolve
    const initial = window.location.hash.slice(1) || '/';
    Router._resolve(initial);
  },
};

window.Router = Router;
