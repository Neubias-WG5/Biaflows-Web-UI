import {createColorStyle, createColorLineStyle, changeOpacity, createStrokeStyle, createLineStrokeStyle} from '@/utils/style-utils.js';
import {TrackCollection} from 'cytomine-client';

export let initialTermsOpacity = 1;
export let initialTracksOpacity = 1;
export let initialLayersOpacity = 0.15;

export default {
  state() {
    return {
      idImage: 0,

      terms: null,
      tracks: null,

      displayNoTerm: true,
      noTermOpacity: initialTermsOpacity,
      noTermStyle: createColorStyle('#fff', initialLayersOpacity*initialTermsOpacity),

      defaultStyle: createColorStyle('#fff', initialLayersOpacity),
      multipleTermsStyle: createColorStyle('#fff', initialLayersOpacity),

      layersOpacity: initialLayersOpacity,

      multipleTracksStyle: createStrokeStyle('#fff', initialLayersOpacity)
    };
  },

  mutations: {
    setIdImage(state, id) {
      state.idImage = id;
    },

    addTerm(state, term) {
      state.terms.push(formatTerm(term, state.layersOpacity));
    },

    setTerms(state, terms) {
      state.terms = terms;
    },

    addTrack(state, track) {
      state.tracks.push(formatTrack(track, state.layersOpacity));
    },

    setTracks(state, tracks) {
      state.tracks = tracks;
    },

    toggleTermVisibility(state, indexTerm) {
      let term = state.terms[indexTerm];
      term.visible = !term.visible;
    },

    setDisplayNoTerm(state, value) {
      state.displayNoTerm = value;
    },

    setTermOpacity(state, {indexTerm, opacity}) {
      let term = state.terms[indexTerm];
      term.opacity = opacity;
      changeOpacity(term.olStyle, state.layersOpacity*opacity);
      changeOpacity(term.olLineStyle, state.layersOpacity*opacity);
    },

    setNoTermOpacity(state, opacity) {
      state.noTermOpacity = opacity;
      changeOpacity(state.noTermStyle, state.layersOpacity*opacity);
    },

    resetTermOpacities(state) {
      state.terms.forEach(term => {
        term.opacity = initialTermsOpacity;
        changeOpacity(term.olStyle, state.layersOpacity*initialTermsOpacity);
        changeOpacity(term.olLineStyle, state.layersOpacity*initialTermsOpacity);
      });
      state.noTermOpacity = initialTermsOpacity;
      changeOpacity(state.noTermStyle, state.layersOpacity*state.noTermOpacity);
    },

    setLayersOpacity(state, opacity) {
      state.layersOpacity = opacity;
      if(state.terms) {
        state.terms.forEach(term => {
          changeOpacity(term.olStyle, opacity*term.opacity);
          changeOpacity(term.olLineStyle, opacity*term.opacity);
        });
      }
      changeOpacity(state.noTermStyle, opacity*state.noTermOpacity);
      changeOpacity(state.multipleTermsStyle, opacity);
      changeOpacity(state.defaultStyle, opacity);
      if(state.tracks) {
        state.tracks.forEach(track => {
          changeOpacity(track.olStyle, opacity*track.opacity);
          changeOpacity(track.olLineStyle, opacity*track.opacity);
        });
      }
      changeOpacity(state.multipleTracksStyle, opacity);
    },
  },

  actions: {
    async initialize({commit, rootGetters}, {image}) {
      commit('setIdImage', image.id);

      let terms = formatTerms(rootGetters['currentProject/terms'], initialLayersOpacity);
      commit('setTerms', terms);

      let tracks = await fetchTracks(image.id);
      commit('setTracks', formatTracks(tracks, initialLayersOpacity));
    },

    toggleTermVisibility({state, commit}, indexTerm) {
      commit('toggleTermVisibility', indexTerm);
      let toggledTerm = state.terms[indexTerm];
      if(!toggledTerm.visible) {
        commit('removeTermFromSelectedFeatures', {idTerm: toggledTerm.id, terms: state.terms});
      }
    },

    setDisplayNoTerm({commit}, value) {
      commit('setDisplayNoTerm', value);
      if(!value) {
        commit('removeNoTermFromSelectedFeatures');
      }
    },

    async setImageInstance({commit, dispatch}, {image}) {
      commit('setIdImage', image.id);
      await dispatch('refreshTracks');
    },

    async refreshTracks({state, commit}) {
      let tracks = await fetchTracks(state.idImage);
      commit('setTracks', formatTracks(tracks, state.layersOpacity, state.tracks));
    },

    async refreshData({state, commit, rootGetters, dispatch}) {
      let terms = formatTerms(rootGetters['currentProject/terms'], state.layersOpacity, state.terms);
      commit('setTerms', terms);

      await dispatch('refreshTracks');
    }
  },

  getters: {
    termsMapping: state => {
      if(!state.terms) {
        return {};
      }

      return state.terms.reduce((mapping, term) => {
        mapping[term.id] = term;
        return mapping;
      }, {});
    },
    tracksMapping: state => {
      if(!state.tracks) {
        return {};
      }

      return state.tracks.reduce((mapping, track) => {
        mapping[track.id] = track;
        return mapping;
      }, {});
    },
    hiddenTermsIds: state => {
      if (!state.terms) {
        return [];
      }

      let list = state.terms.filter(term => !term.visible).map(term => term.id);
      if (!state.displayNoTerm)
        list.push(0);
      return list || [];
    },
    tracksIds: state => {
      return state.tracks.map(track => track.id);
    },
    layersOpacity: state => state.layersOpacity
  }
};


function formatTerms(terms, layersOpacity, previousTerms=[]) {
  if(!terms) {
    return;
  }

  let result = [];
  let nbTerms = terms.length;
  for(let i = 0; i < nbTerms; i++) {
    let term = terms[i];
    let prevTerm = previousTerms.find(prevTerm => prevTerm.id === term.id);
    result.push(prevTerm ? prevTerm : formatTerm(term, layersOpacity));
  }
  return result;
}

function formatTerm(term, layersOpacity) {
  let result = {id: term.id};
  result.opacity = initialTermsOpacity;
  result.olStyle = createColorStyle(term.color, initialTermsOpacity*layersOpacity);
  result.olLineStyle = createColorLineStyle(term.color, initialTermsOpacity*layersOpacity);
  result.visible = true;
  result.color = term.color;
  return result;
}

function formatTracks(tracks, layersOpacity, previousTracks=[]) {
  if(!tracks) {
    return;
  }

  let cache = {};

  let result = [];
  let nbTracks = tracks.length;
  for(let i = 0; i < nbTracks; i++) {
    let track = tracks[i];
    let prevTrack = previousTracks.find(prevTrack => prevTrack.id === track.id && prevTrack.color === track.color);
    result.push(prevTrack ? prevTrack : formatTrack(track, layersOpacity, cache));
  }
  return result;
}

function formatTrack(track, layersOpacity, cache = {}) {
  let opacity = initialTracksOpacity*layersOpacity;
  if (!cache.hasOwnProperty(`stroke-${track.color}`)) {
    cache[`stroke-${track.color}`] = createStrokeStyle(track.color, opacity);
  }
  if (!cache.hasOwnProperty(`line-stroke-${track.color}`)) {
    cache[`line-stroke-${track.color}`] = createLineStrokeStyle(track.color, opacity);
  }

  let result = {id: track.id, name: track.name};
  result.opacity = initialTracksOpacity;
  result.olStyle = cache[`stroke-${track.color}`];
  result.olLineStyle = cache[`line-stroke-${track.color}`];
  result.color = track.color;
  return result;
}

async function fetchTracks(idImage) {
  let data = (await TrackCollection.fetchAll({filterKey: 'imageinstance', filterValue: idImage})).array;
  return data;
}