<template>
  <cytomine-modal-card :title="$t('how-to-use')" @close="$parent.close()">
    <how-to-use />
  </cytomine-modal-card>
</template>

<script>
import CytomineModalCard from '@/components/utils/CytomineModalCard';
import HowToUse from '@/components/navbar/HowToUse';

export default {
  name: 'hotkeys-modal',
  components: {HowToUse, CytomineModalCard},
};
</script>

<style scoped>
  .modal-card, .modal-card-body {
    width: 70vw;
    min-width: 600px;
    font-weight: normal;
  }
</style>

