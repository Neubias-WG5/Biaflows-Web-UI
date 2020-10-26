<template>
  <b-message v-if="showMessage" :title="landingTitle" :type="landingType" has-icon :closable="false">
    <span v-html="landingMessage"></span>
  </b-message>
</template>

<script>
import constants from '@/utils/constants.js';

export default {
  name: 'SandboxWarning',
  computed: {
    showMessage() {
      return constants.SHOW_LANDING_MESSAGE;
    },
    landingMessage() {
      return constants.LANDING_MESSAGE;
    },
    landingTitle() {
      return constants.LANDING_MESSAGE_TITLE;
    },
    landingType() {
      return constants.LANDING_MESSAGE_TYPE || 'is-info';
    }

  }
};
</script>

<style scoped>

</style>