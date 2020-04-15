<template>
  <b-message v-if="isSandbox" title="Warning !" type="is-warning" has-icon :closable="false">
    This instance is a <strong>sandbox</strong>. <span v-html="sandboxMessage"></span>
  </b-message>
</template>

<script>
import constants from '@/utils/constants.js';

export default {
  name: 'SandboxWarning',
  computed: {
    isSandbox() {
      return constants.IS_SANDBOX;
    },
    sandboxMessage() {
      return constants.SANDBOX_MESSAGE;
    }
  }
};
</script>

<style scoped>

</style>