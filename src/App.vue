<template>
<div id="app" class="wrapper">
  <notifications position="top center" width="30%" :max="5">
    <template #body="props">
      <div class="notification vue-notification" :class="props.item.type">
        <button class="delete" @click="props.close"></button>
        <strong class="notification-title">
          {{props.item.title}}
        </strong>
        <div class="notification-content" v-html="props.item.text"></div>
      </div>
    </template>
  </notifications>

  <template v-if="!loading">
    <div class="box error" v-if="communicationError">
      <h2>
        {{$t('communication-error')}}
      </h2>
      {{$t('core-cannot-be-reached')}}<br>
      Try on <a :href="host">{{host}}</a>.
    </div>

    <template v-else-if="!currentUser">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-two-thirds">
            <h1 class="title biaflows">
              <span>BIA</span>FLOWS
            </h1>
            <h3 class="subtitle biaflows">
              A <span>B</span>io <span>I</span>mage <span>A</span>nalysis work<span>flows</span> benchmarking platform.
            </h3>
          </div>
          <div class="column">
            <login />
          </div>
        </div>
        <div class="columns">
          <div class="column has-text-centered">
            <div>
              <div class="video">
                <iframe src="https://www.loom.com/embed/df9dde48a5e949d3b6a4c63bf34063ac" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
              </div>
              <p class="heading">{{$t('video-introduction')}}</p>
            </div>

          </div>
          <div class="column  has-text-centered">
            <div>
              <div class="video">
                <iframe src="https://www.loom.com/embed/dbb2d4558ced43fdb021f194aabeb40d" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
              </div>
              <p class="heading">{{$t('video-compare-workflows')}}</p>
            </div>

          </div>
          <div class="column has-text-centered">
            <div>
              <div class="video">
                <iframe src="https://www.loom.com/embed/58c7d85ff43d421ab0a97e0714a62aaf" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
              </div>
              <p class="heading">{{$t('video-multidimensional-images')}}</p>
            </div>

          </div>
          <div class="column has-text-centered">
            <div>
              <div class="video">
                <iframe src="https://www.loom.com/embed/effe28d498e64ef29fd5dbff745aa76f" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe>
              </div>
              <p class="heading">{{$t('video-workflow-source-code')}}</p>
            </div>

          </div>
        </div>
      </div>
      <footer class="footer">
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
      </footer>
    </template>


    <template v-else>
      <cytomine-navbar />
      <div class="bottom">
        <keep-alive include="cytomine-storage">
          <router-view v-if="currentUser" />
        </keep-alive>
      </div>
    </template>
  </template>
</div>
</template>

<script>
import {get} from '@/utils/store-helpers';
import {changeLanguageMixin} from '@/lang.js';

import CytomineNavbar from './components/navbar/CytomineNavbar.vue';
import Login from './components/user/Login.vue';

import {Cytomine} from 'cytomine-client';

import constants from '@/utils/constants.js';
import ifvisible from 'ifvisible';
ifvisible.setIdleDuration(constants.IDLE_DURATION);

export default {
  name: 'app',
  components: {CytomineNavbar, Login},
  mixins: [changeLanguageMixin],
  data() {
    return {
      communicationError: false,
      loading: true,
      timeout: null
    };
  },
  computed: {
    currentUser: get('currentUser/user'),
    project: get('currentProject/project'),
    host() {
      return constants.CYTOMINE_CORE_HOST;
    }
  },
  methods: {
    async loginWithToken() {
      try {
        await Cytomine.instance.loginWithToken(this.$route.query.username, this.$route.query.token);
        await this.fetchUser();
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t('invalid-token')});
      }
    },
    async ping() {
      if(!ifvisible.now()){
        return; // window not visible or inactive user => stop pinging
      }
      try {
        let {authenticated} = await Cytomine.instance.ping(this.project ? this.project.id : null);
        if(this.currentUser && !authenticated) {
          await this.$store.dispatch('logout');
        }
        if(!this.currentUser && authenticated) {
          await this.fetchUser();
        }
        this.communicationError = false;
      }
      catch(error) {
        console.log(error);
        this.communicationError = true;
      }

      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.ping, constants.PING_INTERVAL);
    },
    async fetchUser() {
      await this.$store.dispatch('currentUser/fetchUser');
      if(this.currentUser) {
        this.changeLanguage(this.currentUser.language);
      }
    }
  },
  async created() {
    if(this.$route.query.token && this.$route.query.username) {
      await this.loginWithToken();
    }
    await this.ping();
    this.loading = false;
    ifvisible.on('wakeup', this.ping);
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/main.scss';

@font-face {
  font-family: 'cytomine';
  src: url('assets/cytomine-font.woff') format('woff');
}

html, body {
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif, sans-serif;
  color: #333;
  background: #d4d4d4;
}

.wrapper {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  background: #d4d4d4;
}

.box.error {
  max-width: 600px;
  margin: auto;
  margin-top: 3rem;
}

.notifications {
  margin-top: 1em;
}

.notification.info {
  background: #77b1ea;
}

.bottom {
  flex: 1;
  overflow-y: auto;
  /* position: relative; */
}

h1 {
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  font-size: 1.25rem;
  text-align: center;
  padding: 0.9rem;
}

h2 {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08rem;
  margin-bottom: 1rem;
}

.in-project {
  color: grey;
  font-size: 0.8em;
}

.input[readonly] {
  background-color: whitesmoke;
}

strong, .label {
  font-weight: 600 !important;
}

.content-wrapper {
  padding: 1.5% 2.5%;
  position: relative;
  min-height: 100%;
}

/* Filters */

.filters {
  background: #f8f8f8;
  margin-top: 1.2rem;
  border-radius: 10px;
  padding: 1rem;
}

.filter-label {
  text-transform: uppercase;
  font-size: 0.8em;
  margin-bottom: 0.5em;
  margin-left: 1em;
}

.filter-label .no-uppercase {
  text-transform: none;
}

.nb-active-filters {
  display: inline-block;
  background: $primary;
  color: $primary-invert;
  min-width: 1.25rem;
  height: 1.25rem;
  font-weight: 600;
  border-radius: 0.625rem;
  margin-left: 0.5em;
  font-size: 0.9em;
  line-height: 1.25em;
  padding: 0 0.25em;
  position: absolute;
  top: -0.3em;
  right: -0.6em;
}

/* For correct display of svg images on IE > 10 */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  img[src$=".svg"] {
    width: 100%;
  }
}
</style>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
}

h1 {
  text-align: left;
}

footer .sponsor {
  max-height: 3rem;
  margin-right: 0.5rem;
}

.footer {
  padding: 3rem 1.5rem;
}

.video {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  width: 100%;
}

.column .heading {
  margin-top: 0.25rem;
}
</style>
