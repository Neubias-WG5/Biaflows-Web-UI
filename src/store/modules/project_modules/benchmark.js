export default {
  namespaced: true,

  state() {
    return {
      filters: {
        images: null,
        metrics: null,
        jobParameters: null,
        aggregates: null
      },

      currentTab: 0,
      openedImageDetails: [],

      currentPage: 1,
      perPage: 10,
      sort: {
        field: '',
        order: ''
      },
    };
  },

  mutations: {
    setFilter(state, {filterName, propValue}) {
      state.filters[filterName] = propValue;
    },

    setCurrentPage(state, page) {
      state.currentPage = page;
    },

    setPerPage(state, perPage) {
      state.perPage = perPage;
    },

    setSort(state, sort) {
      state.sort = sort;
    },

    setCurrentTab(state, tab) {
      state.currentTab = tab;
    },

    setOpenedImageDetails(state, value) {
      state.openedImageDetails = value;
    },
  }
};
