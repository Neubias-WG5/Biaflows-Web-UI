import {createGeoJsonFmt} from 'vuelayers/lib/ol-ext/format';

export default {
  state() {
    return {
      selectedFeatures: [],
      annotsToSelect: [],
      showComments: null, // set to the identifier of an annotation to automatically open comments modal if this annotation if the first to be selected
      displayAnnotDetails: true,
      positionAnnotDetails: {x: 0, y: 0},
    };
  },

  mutations: {
    setSelectedFeatures(state, selectedFeatures) {
      state.selectedFeatures = selectedFeatures;
    },

    clearSelectedFeatures(state) {
      state.selectedFeatures = [];
      state.annotsToSelect = [];
    },

    selectFeature(state, feature) {
      state.selectedFeatures.push(createGeoJsonFmt().writeFeatureObject(feature));
    },

    changeAnnotSelectedFeature(state, {indexFeature, annot}) {
      state.selectedFeatures[indexFeature].properties.annot = annot;
    },

    removeLayerFromSelectedFeatures(state, {idLayer, cache=false}) {
      let selectedFeatures = state.selectedFeatures;
      for(let index = selectedFeatures.length - 1; index >= 0; index--) {
        let feature = selectedFeatures[index];
        let annot = feature.properties.annot;
        if(annot.user === idLayer) {
          selectedFeatures.splice(index, 1);
          if(cache) {
            state.annotsToSelect.push(annot);
          }
        }
      }

      if(!cache) {
        state.annotsToSelect = state.annotsToSelect.filter(annot => annot.user !== idLayer);
      }
    },

    removeTermFromSelectedFeatures(state, {idTerm, terms}) { // idTerm: id of the term no longer displayed
      state.selectedFeatures = state.selectedFeatures.filter(feature => {
        let annot = feature.properties.annot;
        if(!annot.term.includes(idTerm)) {
          return true; // feature not affected since it does not have the hidden term
        }
        // if feature associated with hidden term, check if it is associated to other terms still displayed
        return terms.some(term => term.visible && annot.term.includes(term.id));
      });
    },

    removeNoTermFromSelectedFeatures(state) {
      state.selectedFeatures = state.selectedFeatures.filter(feature => {
        let annot = feature.properties.annot;
        return annot.term.length; // keep feature only iff it is associated to at least one term
      });
    },

    setAnnotToSelect(state, annot) {
      state.annotsToSelect = [annot];
    },

    setShowComments(state, annot) {
      state.showComments = annot ? annot.id : null;
    },

    setDisplayAnnotDetails(state, value) {
      state.displayAnnotDetails = value;
    },

    setPositionAnnotDetails(state, value) {
      state.positionAnnotDetails = value;
    },
  },

  actions: {
    selectFeature({commit}, feature) {
      commit('clearSelectedFeatures');
      commit('selectFeature', feature);
    },

    setImageInstance({commit}) {
      commit('clearSelectedFeatures');
    }
  },

  getters: {
    selectedFeature: state => {
      if(state.selectedFeatures.length === 1) {
        return state.selectedFeatures[0];
      }
    }
  }
};