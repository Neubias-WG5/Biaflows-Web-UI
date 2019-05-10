import {ImageInstance, AbstractImage, AnnotationType} from 'cytomine-client';

import constants from '@/utils/constants';

import colors from './image_modules/colors';
import draw from './image_modules/draw';
import layers from './image_modules/layers';
import properties from './image_modules/properties';
import selectedFeatures from './image_modules/selected-features';
import style from './image_modules/style';
import tracking from './image_modules/tracking';
import undoRedo from './image_modules/undo-redo';
import view from './image_modules/view';

import {
  isCluster,
  createTextStyle,
  selectStyles,
  verticesStyle,
  reviewedStyles,
  reviewedSelectStyles
} from '@/utils/style-utils.js';

export default {
  namespaced: true,

  state() {
    return {
      imageInstance: null,
      activePanel: null
    };
  },

  mutations: {
    setImageInstance(state, image) {
      state.imageInstance = image;
    },

    setResolution(state, resolution) {
      state.imageInstance.resolution = resolution;
    },

    togglePanel(state, panel) {
      state.activePanel = state.activePanel === panel ? null : panel;
    }
  },

  actions: {
    async initialize({commit}, image) {
      let clone = image.clone();
      await fetchImageServers(clone);
      commit('setImageInstance', clone);
    },

    async setImageInstance({dispatch, rootState}, image) {
      await dispatch('initialize', image);
      let idProject = rootState.currentProject.project.id;
      let idViewer = rootState.currentProject.currentViewer;
      dispatch(`projects/${idProject}/viewers/${idViewer}/changePath`, null, {root: true});
    },

    async refreshData({state, commit}) {
      let image = await fetchImage(state.imageInstance.id);
      commit('setImageInstance', image);
    }
  },

  getters: {
    genStyleFunction: state => (feature) => {
      let annot = feature.get('annot');
      if(!annot) {
        return;
      }

      // QUESTION: what to do with clusters (returned count does not take into account the selected terms) ?
      // Possible solutions:
      // 1. in backend, for clusters, send array with composition of cluster (x for term 1, y for term 2, z for term1-2)
      // 2. force source refresh every time the list of terms to display is updated
      // 3. add parameter allowing to provide the terms to take into account in kmeans (but only for kmeans)
      if(isCluster(feature)) {
        return [state.style.defaultStyle, createTextStyle(annot.count.toString())];
      }

      let styles = [];

      let nbTerms = annot.term.length;
      let terms = state.style.terms;

      if(terms && nbTerms === 1) {
        let wrappedTerm = terms.find(term => term.id === annot.term[0]);
        if(wrappedTerm) {
          if(!wrappedTerm.visible) {
            return; // do not display annot
          }
          if(feature.getGeometry().getType() === 'LineString') {
            styles.push(wrappedTerm.olLineStyle);
          }
          else {
            styles.push(wrappedTerm.olStyle);
          }
        }
        else {
          styles.push(state.style.noTermStyle); // could not find term => display no term style
        }
      }
      else if(terms && nbTerms > 1) {
        let hasTermsToDisplay = terms.some(term => term.visible && annot.term.includes(term.id));
        if(!hasTermsToDisplay) {
          return; // do not display
        }
        styles.push(state.style.multipleTermsStyle);
      }
      else {
        if(!state.style.displayNoTerm) {
          return; // do not display annot
        }
        styles.push(state.style.noTermStyle);
      }

      let isReviewed = annot.type === AnnotationType.REVIEWED;

      // Styles for selected elements
      if(state.selectedFeatures.selectedFeatures.map(ftr => ftr.id).includes(feature.getId())) {
        styles.push(...isReviewed ? reviewedSelectStyles : selectStyles);

        // if in modify mode, display vertices
        if(state.draw.activeEditTool === 'modify') {
          styles.push(verticesStyle);
        }
      }
      else if(isReviewed) {
        styles.push(...reviewedStyles);
      }

      // Properties
      let propValue = state.properties.selectedPropertyValues[annot.id];
      if (propValue) {
        let color = state.properties.selectedPropertyColor;
        let fontSize = '34px';
        if(state.view.zoom <= 3) {
          fontSize = '12px';
        }
        else if(state.view.zoom <= 6) {
          fontSize = '19px';
        }
        else if(state.view.zoom <= 8) {
          fontSize = '26px';
        }
        styles.push(createTextStyle(propValue, fontSize, color.fill, null));
      }

      return styles;
    },

    maxZoom: state => {
      if(!state.imageInstance) {
        return 0;
      }
      let increment = state.view.digitalZoom ? constants.DIGITAL_ZOOM_INCREMENT : 0;
      return state.imageInstance.depth + increment;
    }
  },

  modules: {
    colors,
    draw,
    layers,
    properties,
    selectedFeatures,
    style,
    tracking,
    undoRedo,
    view
  }
};

async function fetchImage(idImage) {
  let image = await ImageInstance.fetch(idImage);
  await fetchImageServers(image);
  return image;
}

async function fetchImageServers(image) {
  if(!image.imageServerURLs) {
    image.imageServerURLs = await new AbstractImage({id: image.baseImage}).fetchImageServers();
  }
}