<template>
<div>
  <h1>
    {{$t('information')}}
  </h1>
  <table class="table">
    <tbody>
      <tr>
        <td><strong>{{$t('name')}}</strong></td>
        <td><image-name :image="image" showBothNames /></td>
      </tr>
      <tr>
        <td><strong>{{$t('width')}}</strong></td>
        <td>{{image.width}} {{$t("pixels")}}</td>
      </tr>
      <tr>
        <td><strong>{{$t('height')}}</strong></td>
        <td>{{image.height}} {{$t("pixels")}}</td>
      </tr>
      <tr v-if="image.depth > 1">
        <td><strong>{{$t('image-depth')}}</strong>
        <td>{{$tc("count-slices", image.depth, {count: image.depth})}}</td>
      </tr>
      <tr v-if="image.duration > 1">
        <td><strong>{{$t('image-time')}}</strong></td>
        <td>{{$tc("count-frames", image.duration, {count: image.duration})}}</td>
      </tr>
      <tr v-if="image.channels > 1">
        <td><strong>{{$t('image-channels')}}</strong></td>
        <td>{{$tc("count-bands", image.channels, {count: image.channels})}}</td>
      </tr>
      <tr>
        <td><strong>{{$t('resolution')}}</strong></td>
        <td v-if="image.physicalSizeX">{{image.physicalSizeX.toFixed(3)}} {{$t("um-per-pixel")}}</td>
        <td v-else>{{$t("unknown")}}</td>
      </tr>
      <tr v-if="image.depth > 1">
        <td><strong>{{$t('z-resolution')}}</strong></td>
        <td v-if="image.physicalSizeZ">{{image.physicalSizeZ.toFixed(3)}} {{$t("um-per-slice")}}</td>
        <td v-else>{{$t("unknown")}}</td>
      </tr>
      <tr v-if="image.duration > 1">
        <td><strong>{{$t('frame-rate')}}</strong></td>
        <td v-if="image.fps">{{image.fps.toFixed(3)}} {{$t("frame-per-second")}}</td>
        <td v-else>{{$t("unknown")}}</td>
      </tr>
      <tr>
        <td><strong>{{$t('magnification')}}</strong></td>
        <td v-if="image.magnification">{{image.magnification}}</td>
        <td v-else>{{$t('unknown')}}</td>
      </tr>
      <tr>
        <td colspan="2" class="buttons-wrapper">
          <div class="buttons">
            <button v-if="canEdit" class="button is-small" @click="calibrationModal = true">
              {{$t('button-set-calibration')}}
            </button>
            <router-link :to="`/project/${image.project}/image/${image.id}/information`" class="button is-small">
              {{$t('button-more-info')}}
            </router-link>
            <a class="button is-small" :href="image.downloadURL">
              {{$t('button-download')}}
            </a>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="2" class="buttons-wrapper">
          <div class="buttons navigation has-addons">
            <button class="button is-small" @click="previousImage()" :disabled="isFirstImage">
              <i class="fas fa-angle-left fa-lg"></i> {{$t('button-previous-image')}}
            </button>
            <button class="button is-small" @click="nextImage()" :disabled="isLastImage">
              {{$t('button-next-image')}} <i class="fas fa-angle-right fa-lg"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <calibration-modal
    :image="image"
    :active.sync="calibrationModal"
    @setResolution="setResolution"
  />
</div>
</template>

<script>
import ImageName from '@/components/image/ImageName';
import CalibrationModal from '@/components/image/CalibrationModal';

export default {
  name: 'information-panel',
  components: {
    ImageName,
    CalibrationModal
  },
  props: {
    index: String
  },
  data() {
    return {
      calibrationModal: false,
      isFirstImage: false,
      isLastImage: false
    };
  },
  computed: {
    viewerModule() {
      return this.$store.getters['currentProject/currentViewerModule'];
    },
    imageModule() {
      return this.$store.getters['currentProject/imageModule'](this.index);
    },
    viewerWrapper() {
      return this.$store.getters['currentProject/currentViewer'];
    },
    image() {
      return this.viewerWrapper.images[this.index].imageInstance;
    },
    canEdit() {
      return this.$store.getters['currentProject/canEditImage'](this.image);
    },
    isActiveImage() {
      return this.viewerWrapper.activeImage === this.index;
    }
  },
  methods: {
    setResolution(resolution) {
      this.$store.dispatch(this.viewerModule + 'setImageResolution', {idImage: this.image.id, resolution});
      this.$eventBus.$emit('reloadAnnotations', {idImage: this.image.id}); // refresh the sources to update perimeter/area
    },
    async previousImage() {
      try {
        let prev = await this.image.fetchPrevious();
        if(!prev.id) {
          this.$notify({type: 'error', text: this.$t('notif-error-first-image')});
          this.isFirstImage = true;
        }
        else {
          let slice = await prev.fetchReferenceSlice();
          await this.$store.dispatch(this.imageModule + 'setImageInstance', {image: prev, slice});
        }
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t('notif-error-fetch-previous-image')});
      }
    },
    async nextImage() {
      try {
        let next = await this.image.fetchNext();
        if(!next.id) {
          this.$notify({type: 'error', text: this.$t('notif-error-last-image')});
          this.isLastImage = true;
        }
        else {
          let slice = await next.fetchReferenceSlice();
          await this.$store.dispatch(this.imageModule + 'setImageInstance', {image: next, slice});
        }
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t('notif-error-fetch-next-image')});
      }
    },

    shortkeyHandler(key) {
      if(!this.isActiveImage) { // shortkey should only be applied to active map
        return;
      }

      if(key === 'nav-next-image') {
        this.nextImage();
      }
      else if(key === 'nav-previous-image') {
        this.previousImage();
      }
    }
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
.table {
  margin-bottom: 0 !important;
  width: 100%;
  table-layout: fixed;
}

td {
  word-wrap: break-word;
}

td:first-child {
  width: 10em;
}

.buttons-wrapper {
  padding-left: 0;
  padding-right: 0;
}

.buttons {
  justify-content: center;
}

.buttons.navigation {
  margin-top: 0.7em;
  margin-bottom: 0;
  border-width: 0;
}

.fa-angle-left {
  margin-right: 0.4em;
}

.fa-angle-right {
  margin-left: 0.4em;
}
</style>
