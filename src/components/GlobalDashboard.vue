<template>
<div class="content-wrapper">
  <b-loading :is-full-page="false" :active.sync="loading" />

  <template v-if="!loading">
    <sandbox-warning />

    <div class="box">
      <div class="level level-logo">
        <div class="level-left">
          <img src="@/assets/logo.png" class="full-logo" alt="Biaflows">
        </div>
        <div class="level-left level-logo-title">
          <h3 class="subtitle biaflows">
            A <span>B</span>io <span>I</span>mage <span>A</span>nalysis work<span>flows</span> benchmarking platform.
            <br>
            <span>BIA</span>FLOWS helps comparing bio image analysis workflows by benchmarking them on annotated datasets and simplifying their reproducible deployment.
          </h3>
        </div>
      </div>
    </div>

<!--    <div v-if="welcomeMessage" class="box" v-html="welcomeMessage"></div>-->

    <div class="box">
      <h2 class="biaflows">How to use <span>BIA</span>FLOWS</h2>
      <how-to-use />
    </div>

<!--    <div class="columns">-->
<!--      <div class="column is-two-thirds">-->
<!--        <div class="box">-->
<!--          <h2> {{ $t('recently-opened') }} </h2>-->
<!--          <b-message v-if="!recentProjects" type="is-danger" has-icon icon-size="is-small">-->
<!--            {{$t('failed-fetch-recent-projects')}}-->
<!--          </b-message>-->
<!--          <b-table v-else :data="recentProjects">-->

<!--            <template #default="{row: project}">-->
<!--              <b-table-column :label="$t('project')" width="100" centered>-->
<!--                <router-link class="project-name" :to="`/project/${project.id}`">-->
<!--                  {{ project.name }}-->
<!--                </router-link>-->
<!--              </b-table-column>-->

<!--              <b-table-column :label="$t('images')" width="400">-->
<!--                <list-images-preview :project="project" />-->
<!--              </b-table-column>-->
<!--            </template>-->

<!--            <template #empty>-->
<!--              <div class="content has-text-grey has-text-centered">-->
<!--                <p>{{$t('no-recent-project')}}</p>-->
<!--              </div>-->
<!--            </template>-->
<!--          </b-table>-->

<!--          <p class="has-text-centered all-projects">-->
<!--            <router-link class="button is-link" to="/projects">{{$t('view-all-projects')}}</router-link>-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->

<!--      <div class="column right-column">-->
        <div class="box stats">
          <h2> {{ $t('statistics') }} </h2>
          <div class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">{{$t('projects')}}</p>
                <p class="title">{{projects ? projects.length : "?"}}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">{{$t('images')}}</p>
                <p class="title">{{nbImages != null ? nbImages : "?"}}</p>
              </div>
            </div>
<!--            <div class="level-item has-text-centered">-->
<!--              <div>-->
<!--                <p class="heading">{{$t('algorithms')}}</p>-->
<!--                <p class="title">{{nbAlgorithms != null ? nbAlgorithms : "?"}}</p>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="level-item has-text-centered">-->
<!--              <div>-->
<!--                <p class="heading">{{$t('analyses')}}</p>-->
<!--                <p class="title">{{nbJobs != null ? nbJobs : "?"}}</p>-->
<!--              </div>-->
<!--            </div>-->
          </div>
<!--          <table class="table is-fullwidth">-->
<!--            <tbody>-->
<!--              <tr>-->
<!--                <td>{{projects ? projects.length : "?"}}</td>-->
<!--                <td>{{$t('projects')}}</td>-->
<!--                <td>-->
<!--                  <v-popover>-->
<!--                    <i class="fas fa-info-circle"></i>-->
<!--                    <template #popover>-->
<!--                      <p>{{$t('number-projects-info-message')}}</p>-->
<!--                    </template>-->
<!--                  </v-popover>-->
<!--                </td>-->
<!--              </tr>-->
<!--              <tr>-->
<!--                <td>{{nbImages != null ? nbImages : "?"}}</td>-->
<!--                <td>{{$t('images')}}</td>-->
<!--                <td>-->
<!--                  <v-popover>-->
<!--                    <i class="fas fa-info-circle"></i>-->
<!--                    <template #popover>-->
<!--                      <p>{{$t('number-images-info-message')}}</p>-->
<!--                    </template>-->
<!--                  </v-popover>-->
<!--                </td>-->
<!--              </tr>-->
<!--              <tr>-->
<!--                <td>{{nbUserAnnots != null ? nbUserAnnots : "?"}}</td>-->
<!--                <td>{{$t('user-annotations')}}</td>-->
<!--                <td>-->
<!--                  <v-popover>-->
<!--                    <i class="fas fa-info-circle"></i>-->
<!--                    <template #popover>-->
<!--                      <p>{{$t('number-annotations-info-message')}}</p>-->
<!--                    </template>-->
<!--                  </v-popover>-->
<!--                </td>-->
<!--              </tr>-->
<!--              <tr>-->
<!--                <td>{{nbReviewed != null ? nbReviewed : "?"}}</td>-->
<!--                <td>{{$t('reviewed-annotations')}}</td>-->
<!--                <td>-->
<!--                  <v-popover>-->
<!--                    <i class="fas fa-info-circle"></i>-->
<!--                    <template #popover>-->
<!--                      <p>{{$t('number-reviewed-annotations-info-message')}}</p>-->
<!--                    </template>-->
<!--                  </v-popover>-->
<!--                </td>-->
<!--              </tr>-->
<!--            </tbody>-->
<!--          </table>-->
<!--        </div>-->

<!--        <div class="box">-->
<!--          <h2> {{ $t('last-opened-image') }} </h2>-->
<!--          <image-preview-->
<!--            v-if="lastOpenedImage"-->
<!--            :image="lastOpenedImage"-->
<!--            :fullHeightCard="false"-->
<!--            :showProject="true"-->
<!--            :blindMode="lastOpenedImage.blindMode"-->
<!--          />-->
<!--          <div class="has-text-grey has-text-centered" v-else>-->
<!--            {{$t('no-recent-image')}}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>

    <div class="box">
      <h2>{{$t('sponsors')}}</h2>
      <div class="content has-text-centered">
        <a href="http://neubias.org/" target="_blank">
          <img src="@/assets/sponsors/logo-neubias.png" class="sponsor">
        </a>
        <a href="https://cost.eu/COST_Actions/ca/CA15124" target="_blank">
          <img src="@/assets/sponsors/logo-cost.png" class="sponsor">
        </a>
        <a href="https://cytomine.org" target="_blank">
          <img src="@/assets/sponsors/logo-cytomine-org.png" class="sponsor">
        </a>
        <a href="http://europe.wallonie.be/" target="_blank">
          <img src="@/assets/sponsors/logo-feder.jpg" class="sponsor">
        </a>
      </div>
    </div>
  </template>
</div>
</template>

<script>
import {get} from '@/utils/store-helpers';

import ListImagesPreview from '@/components/image/ListImagesPreview';
import ImagePreview from '@/components/image/ImagePreview';

import {ImageInstanceCollection, ProjectCollection, Configuration} from 'cytomine-client';

import constants from '@/utils/constants.js';
import HowToUse from '@/components/navbar/HowToUse';
import SandboxWarning from '@/components/utils/SandboxWarning';

export default {
  name: 'global-dashboard',
  components: {
    SandboxWarning,
    HowToUse,
    ListImagesPreview,
    ImagePreview
  },
  props: {
    nbRecent: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      projects: null,
      recentProjectsId: null,
      recentImages: [],
      nbUserAnnots: null,
      nbReviewed: null,
      nbAlgorithms: null,
      nbJobs: null,
      welcomeMessage: null,
      loading: true
    };
  },
  computed: {
    currentUser: get('currentUser/user'),

    nbImages() {
      if(!this.projects) {
        return;
      }

      return this.projects.array.reduce((count, project) => {
        return count + project.numberOfImages;
      }, 0);
    },
    recentProjects() {
      if(!this.recentProjectsId || !this.projects) {
        return;
      }

      let array = [];
      this.recentProjectsId.forEach(id => {
        let project = this.projects.array.find(project => project.id === id);
        if(project) {
          array.push(project);
        }
      });
      return array;
    },
    lastOpenedImage() {
      if(this.recentImages && this.recentImages.length > 0 && this.projects) {
        let lastOpened = this.recentImages[0];
        let project = this.projects.array.find(project => project.id === lastOpened.project);
        if(project) {
          lastOpened.projectName = project.name;
          lastOpened.blindMode = project.blindMode;
        }
        return lastOpened;
      }
    }
  },
  methods: {
    async fetchProjects() {
      this.projects = await ProjectCollection.fetchAll();
    },
    async fetchNbAnnots() {
      this.nbUserAnnots = await this.currentUser.fetchNbAnnotations();
    },
    async fetchNbReviewedAnnots() {
      this.nbReviewed = await this.currentUser.fetchNbAnnotations(true);
    },
    async fetchRecentProjectsId() {
      let listRecent = await ProjectCollection.fetchLastOpened(this.nbRecent);
      this.recentProjectsId = listRecent.map(recent => recent.id);
    },
    async fetchRecentImages() {
      this.recentImages = await ImageInstanceCollection.fetchLastOpened({max: 1});
    },
    async fetchWelcomeMessage() {
      try {
        this.welcomeMessage = (await Configuration.fetch(constants.CONFIG_KEY_WELCOME)).value;
      }
      catch(error) {
        // no welcome message defined
      }
    }
  },
  async created() {
    await Promise.all([
      this.fetchProjects(),
      this.fetchNbAnnots(),
      this.fetchNbReviewedAnnots(),
      this.fetchRecentProjectsId(),
      this.fetchRecentImages(),
      this.fetchWelcomeMessage()
    ].map(p => p.catch(e => console.log(e)))); // ignore errors (handled in template) and ensure all promises finish, even if some errors occur in the process
    this.loading = false;
  }
};
</script>

<style scoped>
td {
  vertical-align: middle !important;
}

a.project-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.all-projects {
  margin-top: 1rem;
}

.right-column {
  display: flex;
  flex-direction: column;
}

.stats {
  padding-bottom: 2.5rem;
}

td:first-child {
  font-weight: 600;
  text-align: right;
  width: 25%;
}

.fas.fa-info-circle {
  cursor: pointer;
}

.how-to-list {
  list-style-type: decimal;
  margin-left: 2rem;
}

h1 {
  text-align: left;
}

.subtitle:first-child {
  margin-bottom: 0.5rem !important;
}

.sponsor {
  max-height: 3rem;
  margin-right: 0.5rem;
}

.level-logo {
  justify-content: left;
}

.level-logo-title {
  flex-shrink: unset;
}
</style>

<style>
.biaflows span {
  color: #fe7f7f;
}

.full-logo {
  height: 8rem;
  padding-right: 1em;
}
</style>
