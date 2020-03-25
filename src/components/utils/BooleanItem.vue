<template>
  <span v-if="value" class="tag" :class="{'is-success': colored}">
    <i class="fas fa-check"></i>&nbsp;{{$t('yes')}}
  </span>
  <span v-else class="tag" :class="{'is-danger': colored}">
    <i class="fas fa-times"></i>&nbsp;{{$t('no')}}
  </span>
</template>

<script>
export default {
  name: 'boolean-item',
  props: {
    value: Boolean,
    colored: {type: Boolean, default: true}
  }
};
</script>

<style scoped>

</style>
