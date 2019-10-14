<template>
  <cytomine-modal-card :title="$t(`video-${type}`)" @close="$parent.close()">
    <div style="position: relative; padding-bottom: 56.25%; height: 0;">
      <iframe :src="videoSource" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
    </div>
  </cytomine-modal-card>
</template>

<script>
import CytomineModalCard from '@/components/utils/CytomineModalCard';

export default {
  name: 'video-how-to-modal',
  components: {CytomineModalCard},
  props: ['type'],
  computed: {
    videoSource() {
      switch (this.type) {
        case 'introduction':
          return 'https://www.loom.com/embed/df9dde48a5e949d3b6a4c63bf34063ac';
        case 'multidimensional-images':
          return 'https://www.loom.com/embed/58c7d85ff43d421ab0a97e0714a62aaf';
        case 'compare-workflows':
          return 'https://www.loom.com/embed/dbb2d4558ced43fdb021f194aabeb40d';
        case 'workflow-source-code':
          return 'https://www.loom.com/embed/effe28d498e64ef29fd5dbff745aa76f';
      }
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

