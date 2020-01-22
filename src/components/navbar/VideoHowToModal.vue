<template>
  <cytomine-modal-card :title="$t(`screencast`)" @close="$parent.close()">
    <div style="position: relative; padding-bottom: 56.25%;">
      <iframe :src="videoLink" width="640" height="480" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 90%;"></iframe>
    </div>
  </cytomine-modal-card>
</template>

<script>
import CytomineModalCard from '@/components/utils/CytomineModalCard';
import constants from '@/utils/constants.js';

export default {
  name: 'video-how-to-modal',
  components: {CytomineModalCard},
  computed: {
    videoLink() {
      return constants.VIDEO_LINK;
    }
  }
};
</script>

<style scoped>
  .modal-card, .modal-card-body {
    width: 70vw;
    min-width: 600px;
    font-weight: normal;
  }
</style>

