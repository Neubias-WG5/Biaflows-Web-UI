import listImages from './project_modules/list-images.js';
import listAnnotations from './project_modules/list-annotations.js';
import listJobs from './project_modules/list-jobs.js';
import benchmark from './project_modules/benchmark.js';

export default {
  namespaced: true,

  state() {
    return {
      id: null,
      name: null
    };
  },

  mutations: {
    setProject(state, project) {
      state.id = project.id;
      state.name = project.name;
    },
  },

  modules: {
    viewers: {
      namespaced: true
    },
    listImages,
    listAnnotations,
    listJobs,
    benchmark
  }
};
