<template>
<span v-if="resolvedUser">
  <span :class="[online ? 'online-dot' : 'offline-dot']" v-if="online !== null"></span>
  {{displayFullName ? fullName : resolvedUser.username}}</span></template>

<script>
import {User} from 'cytomine-client';
import {fullName} from '@/utils/user-utils.js';

export default {
  name: 'username',
  props: {
    user: Object,
    id: Number, // if user not set, the user corresponding to the provided id will be fetched
    online: {type: Boolean, default: null},
    displayFullName: {type: Boolean, default: true}
  },
  data() {
    return {
      fetchedUser: {}
    };
  },
  computed: {
    resolvedUser() {
      return this.user || this.fetchedUser;
    },
    fullName() {
      return fullName(this.resolvedUser);
    }
  },
  async created() {
    if(!this.user && this.id) {
      this.fetchedUser = await User.fetch(this.id);
    }
  }
};
</script>

<style scoped>
.online-dot, .offline-dot {
  height: 0.8em;
  width: 0.8em;
  border-radius: 50%;
  display: inline-block;
  margin-right: 0.2em;
}

.online-dot {
  background: limegreen;
}

.offline-dot {
  background: lightgrey;
}
</style>
