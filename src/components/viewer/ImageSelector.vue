<template>
<div>
  <div class="image-selector-wrapper" v-show="imageSelectorEnabled">
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <div class="header">
        <div>
          <b-input class="search-images" v-model="searchString" :placeholder="$t('search-placeholder')"
                   type="search" icon="search"
          />
          <b-checkbox v-model="searchInGroundTruth">{{$t('include-groundtruth-images')}}</b-checkbox>
        </div>
        <button class="delete" @click="imageSelectorEnabled = false"></button>
      </div>
      <div class="content-wrapper" v-if="error">
        <b-message type="is-danger" has-icon icon-size="is-small">
          <h2> {{ $t('error') }} </h2>
          <p> {{ $t('unexpected-error-info-message') }} </p>
        </b-message>
      </div>
      <div v-else class="image-selector">
        <div class="card" v-for="image in displayedImages" :key="image.id" :class="{active: alreadyAdded(image)}">
          <a class="card-image" @click="addImage(image)" :style="'background-image: url(' + image.preview + ')'"></a>
          <div class="card-content">
            <div class="content">
              <a @click="addImage(image)">
                <image-name :image="image" />
              </a>
            </div>
          </div>
        </div>

        <button class="button" v-if="nbImagesDisplayed < filteredImages.length" @click="more()">
          {{$t('button-more')}}
        </button>

        <div class="space">&nbsp;</div>
      </div>
    </template>
  </div>

  <a
    class="image-selector-button"
    @click="imageSelectorEnabled = true"
    v-tooltip="{content: $t('add-image'), placement: 'left'}"
  >
    <i class="fas fa-plus"></i>
  </a>
</div>
</template>

<script>
import {get} from '@/utils/store-helpers';

import ImageName from '@/components/image/ImageName';
import {ImageInstanceCollection} from 'cytomine-client';
import {getWildcardRegexp} from '@/utils/string-utils';

export default {
  name: 'image-selector',
  components: {ImageName},
  data() {
    return {
      images: [],
      searchString: '',
      searchInGroundTruth: false,
      nbImagesDisplayed: 20,
      loading: true,
      error: false
    };
  },
  computed: {
    project: get('currentProject/project'),
    viewerModule() {
      return this.$store.getters['currentProject/currentViewerModule'];
    },
    imageSelectorEnabled: {
      get() {
        return this.$store.getters['currentProject/currentViewer'].imageSelector;
      },
      set(value) {
        this.$store.commit(this.viewerModule + 'setImageSelector', value);
      }
    },
    viewerImagesIds() {
      return Object.values(this.$store.getters['currentProject/currentViewer'].images).map(image => image.imageInstance.id);
    },
    filteredImages() { // TODO: in backend
      let filtered = this.images;

      if (!this.searchInGroundTruth) {
        let regexp = getWildcardRegexp('lbl');
        filtered = filtered.filter(image => !regexp.test(image.instanceFilename));
      }

      if(this.searchString) {
        let regexp = getWildcardRegexp(this.searchString);
        filtered =  filtered.filter(image => regexp.test(image.instanceFilename));
      }

      return filtered;
    },
    sortedImages() {
      return this.filteredImages.slice().sort((a, b) => {
        if (this.alreadyAdded(a) && this.alreadyAdded(b)) {
          return 0;
        }
        else if(this.alreadyAdded(a)) {
          return -1;
        }
        else {
          return 1;
        }
      });
    },
    displayedImages() {
      return this.sortedImages.slice(0, this.nbImagesDisplayed);
    }
  },
  methods: {
    async addImage(image) {
      try {
        await image.fetch(); // refetch image to ensure we have latest version
        let slice = await image.fetchReferenceSlice();
        await this.$store.dispatch(this.viewerModule + 'addImage', {image, slice});
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t('notif-error-add-viewer-image')});
      }
    },

    more() {
      this.nbImagesDisplayed += 20;
    },

    toggle() {
      this.imageSelectorEnabled = !this.imageSelectorEnabled;
    },

    shortkeyHandler(key) {
      if (key === 'toggle-add-image') {
        this.toggle();
      }
    },

    alreadyAdded(image) {
      return this.viewerImagesIds.includes(image.id);
    }
  },
  async created() {
    try {
      this.images = (await ImageInstanceCollection.fetchAll({
        filterKey: 'project',
        filterValue: this.project.id
      })).array; // TODO: should not load full array, should be done with backend
    }
    catch(error) {
      console.log(error);
      this.error = true;
    }
    this.loading = false;
  },
  mounted() {
    this.$eventBus.$on('shortkeyEvent', this.shortkeyHandler);
  },
  beforeDestroy() {
    this.$eventBus.$off('shortkeyEvent', this.shortkeyHandler);
  }
};
</script>

<style scoped>
.image-selector-wrapper {
  position: absolute;
  left: 0;
  bottom: 0;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  width: 100%;
  height: 20em;
  z-index: 150;
}

.header {
  padding: 0.75em;
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
}

.header div {
  display: flex;
}

.search-images {
  margin-right: 1em;
}

.image-selector {
  width: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  flex: 1;
}

.card {
  display: inline-block;
  min-width: 12em;
  flex: 0;
  box-sizing: border-box;
  margin: 0.75em;
}

.card-image {
  display: inline-block;
  width: 100%;
  height: 9.5em;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: white;
  border-bottom: 1px solid #ddd;
}

.card-content {
  padding: 0.75em;
  font-size: 0.8rem;
  overflow-wrap: break-word;
  overflow: hidden;
  height: 5em;
}

.space {
  margin-left: 0.5em;
}

.image-selector-button {
  background: #95b5db;
  border: 0.35rem solid white;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  text-align: center;
  line-height: 2.8rem;
  color: white;
  font-size: 1.8rem;
  box-sizing: border-box;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  z-index: 100;
}

.active {
  box-shadow: 0 2px 3px rgba(39, 120, 173, 0.75), 0 0 0 1px rgba(39, 120, 173, 0.75);
  font-weight: 600;
}
</style>
