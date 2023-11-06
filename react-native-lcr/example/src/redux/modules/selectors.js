export const navSelectors = {
  selectRoute: state => {
    console.log(state);
    if (state.nav) {
      state = state.nav;
    }
    const {routes = [], index = 0} = state;
    const route = routes[index];
    if (!route) {
      return null;
    }
    return !route.index ? route.routeName : navSelectors.getRoute(route);
  },
};
