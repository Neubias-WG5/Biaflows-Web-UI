<template>
<div class="image-details-wrapper">
  <table class="table">
    <tbody>
      <tr v-if="isPropDisplayed('overview')">
        <td class="prop-label">{{$t('overview')}}</td>
        <td class="prop-content" colspan="3">
          <router-link :to="`/project/${image.project}/image/${image.id}`">
            <img :src="image.thumb" class="image-overview">
          </router-link>
        </td>
      </tr>
      <tr v-if="isPropDisplayed('status')">
        <td class="prop-label">{{$t('status')}}</td>
        <td class="prop-content" colspan="3">
          <image-status :image="image" />
        </td>
      </tr>
      <tr v-if="isPropDisplayed('numberOfAnnotations')">
        <td class="prop-label">{{$t('user-annotations')}}</td>
        <td class="prop-content" colspan="3">
          <router-link :to="`/project/${image.project}/annotations?image=${image.id}&type=user`">
            {{ image.numberOfAnnotations }}
          </router-link>
        </td>
      </tr>
      <tr v-if="isPropDisplayed('numberOfJobAnnotations')">
        <td class="prop-label">{{$t('analysis-annotations')}}</td>
        <td class="prop-content" colspan="3">
          <router-link :to="`/project/${image.project}/annotations?image=${image.id}&type=algo`">
            {{ image.numberOfJobAnnotations }}
          </router-link>
        </td>
      </tr>
      <tr v-if="isPropDisplayed('numberOfReviewedAnnotations')">
        <td class="prop-label">{{$t('reviewed-annotations')}}</td>
        <td class="prop-content" colspan="3">
          <router-link :to="`/project/${image.project}/annotations?image=${image.id}&type=reviewed`">
            {{ image.numberOfReviewedAnnotations }}
          </router-link>
        </td>
      </tr>
      <tr v-if="isPropDisplayed('description')">
        <td class="prop-label">{{$t('description')}}</td>
        <td class="prop-content" colspan="3">
          <cytomine-description :object="image" :canEdit="canEdit" />
        </td>
      </tr>
      <tr v-if="isPropDisplayed('properties')">
        <td class="prop-label">{{$t('properties')}}</td>
        <td class="prop-content" colspan="3">
          <cytomine-properties :object="image" :canEdit="canEdit" />
        </td>
      </tr>
      <tr v-if="isPropDisplayed('attachedFiles')">
        <td class="prop-label">{{$t('attached-files')}}</td>
        <td class="prop-content" colspan="3">
          <attached-files :object="image" :canEdit="canEdit" />
        </td>
      </tr>
      <tr v-if="isPropDisplayed('slidePreview')">
        <td class="prop-label">{{$t('slide-preview')}}</td>
        <td class="prop-content" colspan="3">
          <a v-if="image.macroURL" @click="isMetadataModalActive = true">
            <img :src="image.macroURL" class="image-overview">
          </a>
          <em v-else>
            {{$t('slide-preview-not-available')}}
          </em>
        </td>
      </tr>
      <tr v-if="isPropDisplayed('originalFilename') && (!blindMode || canManageProject)">
        <td class="prop-label">{{$t('originalFilename')}}</td>
        <td class="prop-content" colspan="3">
          {{image.originalFilename}}
        </td>
      </tr>
      <tr v-if="isPropDisplayed('format')">
        <td class="prop-label">{{$t('format')}}</td>
        <td class="prop-content format" colspan="3">
          {{image.contentType}}
        </td>
      </tr>
      <tr v-if="isPropDisplayed('vendor')">
        <td class="prop-label">{{$t('vendor')}}</td>
        <td class="prop-content" colspan="3">
          <!-- vendor defined in parent component -->
          <img v-if="image.vendor" :src="image.vendor.imgPath" :alt="image.vendor.name"
            :title="image.vendor.name" class="vendor-img">
          <template v-else>{{$t('unknown')}}</template>
        </td>
      </tr>
      <tr v-if="isPropDisplayed('width') || isPropDisplayed('physicalSizeX')">
        <template v-if="isPropDisplayed('width')">
          <td class="prop-label">{{$t("image-width")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('physicalSizeX') ? 1 : 3">
            {{image.width}} {{$t("pixels")}}
            <template v-if="image.physicalSizeX">({{(image.width * image.physicalSizeX).toFixed(3)}} {{$t("um")}})</template>
          </td>
        </template>
        <template v-if="isPropDisplayed('physicalSizeX')">
          <td class="prop-label">{{$t("x-resolution")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('width') ? 1 : 3">
            <template v-if="image.physicalSizeX">{{image.physicalSizeX.toFixed(3)}} {{$t("um-per-pixel")}}</template>
            <template v-else>{{$t("unknown")}}</template>
          </td>
        </template>
      </tr>
      <tr v-if="isPropDisplayed('height') || isPropDisplayed('physicalSizeY')">
        <template v-if="isPropDisplayed('height')">
          <td class="prop-label">{{$t("image-height")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('physicalSizeY') ? 1 : 3">
            {{image.height}} {{$t("pixels")}}
            <template v-if="image.physicalSizeY">({{(image.height * image.physicalSizeY).toFixed(3)}} {{$t("um")}})</template>
          </td>
        </template>
        <template v-if="isPropDisplayed('physicalSizeY')">
          <td class="prop-label">{{$t("y-resolution")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('height') ? 1 : 3">
            <template v-if="image.physicalSizeY">{{image.physicalSizeY.toFixed(3)}} {{$t("um-per-pixel")}}</template>
            <template v-else>{{$t("unknown")}}</template>
          </td>
        </template>
      </tr>
      <tr v-if="isPropDisplayed('depth') || isPropDisplayed('physicalSizeZ')">
        <template v-if="isPropDisplayed('depth')">
          <td class="prop-label">{{$t("image-depth")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('physicalSizeZ') ? 1 : 3">
            {{$tc("count-slices", image.depth, {count: image.depth})}}
            <template v-if="image.physicalSizeZ">({{(image.depth * image.physicalSizeZ).toFixed(3)}} {{$t("um")}})</template>
          </td>
        </template>
        <template v-if="isPropDisplayed('physicalSizeZ')">
          <td class="prop-label">{{$t("z-resolution")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('depth') ? 1 : 3">
            <template v-if="image.physicalSizeZ">{{image.physicalSizeZ.toFixed(3)}} {{$t("um-per-slice")}}</template>
            <template v-else-if="image.depth < 2">-</template>
            <template v-else>{{$t("unknown")}}</template>
          </td>
        </template>
      </tr>
      <tr v-if="isPropDisplayed('time') || isPropDisplayed('fps')">
        <template v-if="isPropDisplayed('time')">
          <td class="prop-label">{{$t("image-time")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('fps') ? 1 : 3">
            {{$tc("count-frames", image.duration, {count: image.duration})}}
            <template v-if="image.fps && image.duration > 0">
              ({{formatMinutesSeconds(image.duration / image.fps)}})
            </template>
          </td>
        </template>
        <template v-if="isPropDisplayed('fps')">
          <td class="prop-label">{{$t("frame-rate")}}</td>
          <td class="prop-content-half" :colspan="isPropDisplayed('time') ? 1 : 3">
            <template v-if="image.fps">{{image.fps.toFixed(3)}} {{$t("frame-per-second")}}</template>
            <template v-else-if="image.time < 2">-</template>
            <template v-else>{{$t("unknown")}}</template>
          </td>
        </template>
      </tr>
      <tr v-if="isPropDisplayed('channels')">
        <td class="prop-label">{{$t("image-channels")}}</td>
        <td class="prop-content" colspan="3">
          {{$tc("count-bands", image.channels, {count: image.channels})}}
        </td>
      </tr>
      <tr v-if="isPropDisplayed('size')">
        <td class="prop-label">{{$t('image-size')}}</td>
        <td class="prop-content" colspan="3">
          {{`${image.width} x ${image.height} ${$t('pixels')}`}}
        </td>
      </tr>
      <tr v-if="isPropDisplayed('magnification')">
        <td class="prop-label">{{$t('magnification')}}</td>
        <td class="prop-content" colspan="3">
          <template v-if="image.magnification">{{image.magnification}}</template>
          <template v-else>{{$t('unknown')}}</template>
        </td>
      </tr>
      <tr>
        <td class="prop-label">{{$t('actions')}}</td>
        <td class="prop-content" colspan="3">
          <div class="buttons are-small">
            <button class="button" @click="isMetadataModalActive = true">
              {{$t('button-metadata')}}
            </button>
            <template v-if="canEdit">

              <router-link
                v-if="!image.reviewed && !image.inReview"
                :to="`/project/${image.project}/image/${image.id}?action=review`"
                class="button"
              >
                {{$t('button-start-review')}}
              </router-link>

              <template v-else-if="image.reviewUser === currentUser.id">
                <button v-if="image.reviewed" class="button" @click="cancelReview()">
                  {{$t('button-unvalidate-review')}}
                </button>
                <template v-else>
                  <router-link :to="`/project/${image.project}/image/${image.id}?action=review`" class="button">
                    {{$t('button-continue-review')}}
                  </router-link>
                  <button class="button" @click="cancelReview()">
                    {{$t('button-cancel-review')}}
                  </button>
                </template>
              </template>

              <button v-if="!blindMode || canManageProject" class="button" @click="isRenameModalActive = true">
                {{$t('button-rename')}}
              </button>
              <button class="button" @click="isCalibrationModalActive = true">
                {{$t('button-set-calibration')}}
              </button>
              <button class="button" @click="isMagnificationModalActive = true">
                {{$t('button-set-magnification')}}
              </button>
            </template>
            <a class="button" :href="image.downloadURL">
              {{$t('button-download')}}
            </a>
            <template v-if="canEdit">
              <button class="button is-danger" @click="confirmDeletion()">
                {{$t('button-delete')}}
              </button>
            </template>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <rename-modal
    :title="$t('rename-image')"
    :currentName="image.instanceFilename"
    :active.sync="isRenameModalActive"
    @rename="rename"
  />

  <magnification-modal
    :image="image"
    :active.sync="isMagnificationModalActive"
    @setMagnification="(event) => $emit('setMagnification', event)"
  />

  <calibration-modal
    :image="image"
    :active.sync="isCalibrationModalActive"
    @setResolution="(event) => $emit('setResolution', event)"
  />

  <image-metadata-modal
    :active.sync="isMetadataModalActive"
    :image="image"
  />
</div>
</template>

<script>
import {get} from '@/utils/store-helpers';

import CytomineDescription from '@/components/description/CytomineDescription';
import CytomineProperties from '@/components/property/CytomineProperties';
import AttachedFiles from '@/components/attached-file/AttachedFiles';
import MagnificationModal from './MagnificationModal';
import CalibrationModal from './CalibrationModal';
import ImageMetadataModal from './ImageMetadataModal';
import ImageStatus from './ImageStatus';
import RenameModal from '@/components/utils/RenameModal';

import {formatMinutesSeconds} from '@/utils/slice-utils.js';

import {ImageInstance} from 'cytomine-client';

export default {
  name: 'image-details',
  components: {
    CytomineDescription,
    CytomineProperties,
    AttachedFiles,
    MagnificationModal,
    CalibrationModal,
    ImageMetadataModal,
    ImageStatus,
    RenameModal
  },
  props: {
    image: {type: Object},
    excludedProperties: {type: Array, default: () => []}
  },
  data() {
    return {
      isRenameModalActive: false,
      isCalibrationModalActive: false,
      isMagnificationModalActive: false,
      isMetadataModalActive: false,
    };
  },
  computed: {
    currentUser: get('currentUser/user'),
    blindMode() {
      return this.$store.state.currentProject.project.blindMode;
    },
    canManageProject() {
      return this.$store.getters['currentProject/canManageProject'];
    },
    canEdit() {
      return this.$store.getters['currentProject/canEditImage'](this.image);
    },
    imageNameNotif() {
      return this.blindMode ? this.image.blindedName : this.image.instanceFilename;
    }
  },
  methods: {
    isPropDisplayed(prop) {
      return !this.excludedProperties.includes(prop);
    },

    async cancelReview() {
      let errorLabel = this.image.reviewed ? 'notif-error-unvalidate-review' : 'notif-error-cancel-review';
      try {
        await this.image.stopReview(true);
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t(errorLabel)});
      }
    },

    async rename(newName) {
      let oldName = this.image.instanceFilename;
      try {
        this.image.instanceFilename = newName;
        await this.image.save();
        this.$notify({
          type: 'success',
          text: this.$t('notif-success-image-rename', {imageName: this.image.instanceFilename})
        });
      }
      catch(error) {
        console.log(error);
        this.$notify({
          type: 'error',
          text: this.$t('notif-error-image-rename', {imageName: oldName})
        });
      }
      this.isRenameModalActive = false;
    },

    confirmDeletion() {
      this.$dialog.confirm({
        title: this.$t('delete-image'),
        message: this.$t('delete-image-confirmation-message', {imageName: this.imageNameNotif}),
        type: 'is-danger',
        confirmText: this.$t('button-confirm'),
        cancelText: this.$t('button-cancel'),
        onConfirm: this.deleteImage
      });
    },
    async deleteImage() {
      try {
        await ImageInstance.delete(this.image.id);
        this.$notify({
          type: 'success',
          text: this.$t('notif-success-image-deletion', {imageName: this.imageNameNotif})
        });
        this.$emit('delete');
      }
      catch(err) {
        console.log(err);
        this.$notify({
          type: 'error',
          text: this.$t('notif-error-image-deletion', {imageName: this.imageNameNotif})
        });
      }
    },
    formatMinutesSeconds(time) {
      return formatMinutesSeconds(time);
    }
  }
};
</script>

<style scoped>
.table {
  background: none;
  position: relative;
  margin-bottom: 0 !important;
}

td.prop-label {
  white-space: nowrap;
  font-weight: 600;
}

td.prop-content {
  width: 100%;
}

td.prop-content-half {
  width: 50%;
}

.format {
  text-transform: uppercase;
}

.vendor-img {
  max-height: 4rem;
  max-width: 12rem;
}

.image-overview {
  max-height: 18rem;
  max-width: 50vw;
}
</style>
