import {
  changeOpacity,
  createLineStrokeStyle, createStrokeStyle,
  defaultColors, layerColors, userLayerColor
} from '@/utils/style-utils';

export default {
  state() {
    return {
      selectedLayers: null,
      layerIdx: 0,
      layersColor: true,
    };
  },

  mutations: {
    addLayer(state, layer) {
      if(!state.selectedLayers) {
        state.selectedLayers = [];
      }
      state.selectedLayers.push({...layer});
      if (layer.algo) {
        state.layerIdx += 1;
      }
    },

    removeLayer(state, indexLayer) {
      state.selectedLayers.splice(indexLayer, 1);
    },

    toggleLayerVisibility(state, indexLayer) {
      let layer = state.selectedLayers[indexLayer];
      layer.visible = !layer.visible;
    },

    toggleLayerDrawOn(state, indexLayer) {
      let layer = state.selectedLayers[indexLayer];
      layer.drawOn = !layer.drawOn;
    },

    setLayersColor(state, value) {
      state.layersColor = value;
    },

    filterSelectedLayers(state, idLayers) {
      if(!state.selectedLayers) {
        return;
      }
      state.selectedLayers = state.selectedLayers.filter(layer => idLayers.includes(layer.id));
    },

    setLayersOpacity(state, opacity) {
      if (this.selectedLayers) {
        state.selectedLayers.forEach(layer => {
          changeOpacity(layer.olStyle, opacity);
          changeOpacity(layer.olLineStyle, opacity);
        });
      }
    }
  },

  actions: {
    async addLayer({state, commit, getters}, layer) {
      let color = (layer.algo) ? layerColors[state.layerIdx % defaultColors.length] : userLayerColor;
      layer.color = '#' + color.hexaCode;
      layer.olStyle = createStrokeStyle(layer.color, getters.layersOpacity);
      layer.olLineStyle = createLineStrokeStyle(layer.color, getters.layersOpacity);
      commit('addLayer', layer);
    },

    toggleLayerVisibility({state, commit}, indexLayer) {
      commit('toggleLayerVisibility', indexLayer);
      let layer = state.selectedLayers[indexLayer];
      if(!layer.visible) {
        commit('removeLayerFromSelectedFeatures', {layer});
      }
    },

    removeLayer({state, commit}, indexLayer) {
      let layer = state.selectedLayers[indexLayer];
      commit('removeLayer', indexLayer);
      commit('removeLayerFromSelectedFeatures', {layer});
    }
  },

  getters: {
    selectedLayers: state => state.selectedLayers, // expose in getter function because properties module need access to this value
    nbLayers: state => (state.selectedLayers) ? state.selectedLayers.length : 0,

    layersMapping: state => {
      if(!state.selectedLayers) {
        return {};
      }

      return state.selectedLayers.reduce((mapping, layer) => {
        mapping[layer.id] = layer;
        return mapping;
      }, {});
    },
  }
};
