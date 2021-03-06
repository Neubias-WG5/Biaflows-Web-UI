<template>
  <div class="box error" v-if="permissionError || notFoundError">
    <h2> {{ $t(permissionError ? 'access-denied' : 'not-found') }} </h2>
    <p> {{ $t(permissionError ? 'insufficient-permission' : 'not-found-error') }} </p>
  </div>
  <div v-else class="project-container">
    <project-sidebar v-if="!loading" :key="idProject" />

    <div class="app-content">
      <div class="warning-wrapper" v-if="$route.name !== 'viewer'">
        <sandbox-warning />
      </div>
      <b-loading :is-full-page="false" :active="loading" />
      <router-view v-if="!loading" />
    </div>
  </div>
</template>

<script>
import {get} from '@/utils/store-helpers';
import ProjectSidebar from './ProjectSidebar.vue';
import projectModuleModel from '@/store/modules/project';
import SandboxWarning from '@/components/utils/SandboxWarning';

export default {
  name: 'cytomine-project',
  components: {SandboxWarning, ProjectSidebar},
  data() {
    return {
      loading: true,
      permissionError: false,
      notFoundError: false
    };
  },
  computed: {
    idProject() {
      return this.$route.params.idProject;
    },
    project: get('currentProject/project'),
    projectModule() {
      return this.$store.state.projects[this.idProject];
    }
  },
  watch: {
    async idProject() {
      this.loading = true;
      await this.loadProject();
    },
    projectModule() {
      if(!this.projectModule) {
        console.log('Project closed from external source');
        this.$store.commit('currentProject/resetState');
        this.$router.push('/projects');
      }
    }
  },
  methods: {
    async loadProject() {
      try {
        if(!this.$store.state.projects[this.idProject]) { // module does not exist yet
          this.$store.registerModule(['projects', this.idProject], projectModuleModel);
        }
        await this.$store.dispatch('currentProject/loadProject', this.idProject);
        this.loading = false;
      }
      catch(error) {
        console.log(error);
        if(error.response && error.response.status === 403) {
          this.permissionError = true;
        }
        else {
          this.notFoundError = true;
        }
      }
    }
  },
  async created() {
    await this.loadProject();
  }
};
</script>

<style>
.project-container {
  display: flex;
  height: 100%;
  flex: 1;
  background: #d4d4d4;
  overflow-y: auto;
  position: relative;
}

.app-content {
  flex: 1;
  position: relative;
  overflow-y: auto;
}

.warning-wrapper {
  padding: 1.5% 2.5% 0;
}
</style>
