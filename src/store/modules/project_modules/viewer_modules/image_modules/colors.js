export default {
  state() {
    return {
      contrast: 1,
      gamma: 1,
      inverse: false,

      brightness: 0,
      hue: 0,
      saturation: 0,

      filter: null
    };
  },

  mutations: {
    setBrightness(state, value) {
      state.brightness = value;
    },

    setContrast(state, value) {
      state.contrast = value;
    },

    setGamma(state, value) {
      state.gamma = value;
    },

    setInverse(state, value) {
      state.inverse = value;
    },

    setHue(state, value) {
      state.hue = value;
    },

    setSaturation(state, value) {
      state.saturation = value;
    },

    resetColorManipulation(state) {
      state.brightness = 0;
      state.contrast = 1;
      state.gamma = 1;
      state.inverse = false;
      state.hue = 0;
      state.saturation = 0;
    },

    setFilter(state, filter) {
      state.filter = filter;
    }
  }
};
