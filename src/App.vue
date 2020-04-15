<template>
<div id="app" class="wrapper" :class="{'wrapper-scroll': !currentUser}">
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

      <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <a class="navbar-item" href="/">
            <img src="@/assets/logo-symbol.svg" id="logo" alt="Biaflows">
            <template v-if="instanceName"> {{instanceName}}</template>
          </a>
          <a role="button" class="navbar-burger burger" :class="{'is-active':openedTopMenu}" @click="openedTopMenu=!openedTopMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="topMenu" class="navbar-menu" :class="{'is-active':openedTopMenu}">
          <div class="navbar-start">
            <a class="navbar-item" href="http://biaflows-doc.neubias.org/">
              <span class="icon"><i class="fas fa-book fa-xs"></i></span>Documentation
            </a>
            <a class="navbar-item" href="https://github.com/Neubias-WG5">
              <span class="icon"><i class="fab fa-github fa-xs"></i></span>&nbsp;Code Repository
            </a>
            <a class="navbar-item" href="https://neubias-wg5.github.io/contribute.html">
              <span class="icon"><i class="fas fa-hands-helping fa-xs"></i></span>Contribute
            </a>
            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">
                About
              </a>
              <div class="navbar-dropdown">
                <a class="navbar-item" href="http://eubias.org/NEUBIAS/">
                  NEUBIAS
                </a>
                <a class="navbar-item" href="http://www.cytomine.org">
                  Cytomine
                </a>
                <!--
                <hr class="navbar-divider">
                <a class="navbar-item">
                  Report an issue
                </a>
                -->
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-light is-danger" @click="openModal()">
                  <strong>Log in</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <section class="section">
      <div class="container">
        <sandbox-warning />
        <div class="columns bg-img">
          <div class="column is-half logo-box">
            <img src="@/assets/logo.png" class="full-logo" alt="Biaflows">
            <h3 class="subtitle biaflows is-size-4">
              A <span>B</span>io <span>I</span>mage <span>A</span>nalysis work<span>flows</span> benchmarking platform
            </h3>
            <div class="column biaflows is-size-5 has-text-justified">
              <p>
                <span>BIA</span>FLOWS is an open-source web platform to benchmark and reproducibly deploy <span>B</span>io <span>I</span>mage <span>A</span>nalysis (BIA) work<span>flows</span>.
               </p>
              <div class="column biaflows has-text-centered" style="margin-top:1em;margin-bottom:1em">
                <button class="button is-danger is-rounded is-large" @click="loginGuest()">Try online</button>
              </div>
              <div>
                <p>
                  This online instance gathers annotated images illustrating common <span>BIA</span> problems
                  and reproducible workflows from a large variety of software.
                </p>
                <p><img src="@/assets/software_logos.png" alt="Workflows Software"></p>
              </div>
            </div>
          </div>
          <div class="column has-text-centered video-box">
            <div>
              <div class="video">
                <video src="@/assets/homepage_landingvideo.mp4" onloadeddata="this.play();" playsinline loop muted></video>
                <!--
                <iframe :src="videoLink" width="640" height="480" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;"></iframe>
                -->
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
<!--
      <section class="section">
      <div class="container">
        <div class="column biaflows is-size-5 has-text-justified">
          <p>
            Workflows are packaged with their execution environments from <a target="_blank" href="https://neubias-wg5.github.io/user_guide.html#architecture">documented and versioned source code repositories</a>, and their results can be visualized and benchmarked online. <span>BIA</span>FLOWS can also be deployed as a local image management and analysis solution.
          <br><br>
          <p>
            Visit the <a target="_blank" href="http://biaflows-doc.neubias.org/">documentation portal</a> for more information, and to contribute new content (workflows, images, annotations).
          </p>
        </div>
      </div>
      </section>
-->
      <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column has-text-centered is-three-fifths is-offset-one-fifth">
            <h1 class="title is-1" style="color:rgb(254, 127, 127)">Benchmarking Worflows ?</h1>
            <div>
              <div class="video">
                <iframe src="https://drive.google.com/file/d/15qBBS6wkNrQWfwGwlBFtrjn0iy5RgXNN/preview" width="640" height="480" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="columns">
          <div class="column has-text-centered is-three-fifths is-offset-one-fifth">
            <h1 class="title is-1" style="color:rgb(254, 127, 127)">How to use BIAFLOWS ?</h1>
            <div>
              <div class="video">
                <iframe :src="videoLink" width="640" height="480" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      </section>
<!--
      <div class="container">
        <div class="columns">
          <div class="column is-two-thirds logo-box">
            <img src="@/assets/logo.png" class="full-logo" alt="Biaflows">
            <h3 class="subtitle biaflows">
              A <span>B</span>io <span>I</span>mage <span>A</span>nalysis work<span>flows</span> benchmarking platform
            </h3>
          </div>
          <div class="column">
            <login />
          </div>
        </div>
        <div class="columns">
          <div class="column biaflows is-size-5 has-text-justified">
            <p>
              <span>BIA</span>FLOWS is a web platform to benchmark and reproducibly deploy <span>B</span>io <span>I</span>mage <span>A</span>nalysis (BIA) work<span>flows</span>.
              <br><br>
              This demo online instance gathers annotated images illustrating common <span>BIA</span> problems, and associated workflows targeting a broad range of software.
              <br><br>
              Workflows are packaged with their execution environments from <a target="_blank" href="https://neubias-wg5.github.io/user_guide.html#architecture">documented and versioned source code repositories</a>, and their results can be visualized and benchmarked online. <span>BIA</span>FLOWS can also be deployed as a local image management and analysis solution.
              <br><br>
              Visit the <a target="_blank" href="http://biaflows-doc.neubias.org/">documentation portal</a> for more information, and to contribute new content (workflows, images, annotations).
            </p>
          </div>
        </div>
        <div class="columns">
          <div class="column has-text-centered">
            <div>
              <div class="video">
                <iframe src="https://drive.google.com/file/d/15qBBS6wkNrQWfwGwlBFtrjn0iy5RgXNN/preview" width="640" height="480" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;"></iframe>
              </div>
            </div>
          </div>

          <div class="column has-text-centered">
            <div>
              <div class="video">
                <iframe :src="videoLink" width="640" height="480" style="position: absolute;top: 0px;left: 0px;width: 100%;height: 100%;"></iframe>
              </div>
            </div>
          </div>
        </div>
        <div class="columns">
          <div class="column biaflows">
            <div class="buttons">
              <a href="http://biaflows-doc.neubias.org/" class="button is-fullwidth is-medium is-dark" target="_blank"><i class="fas fa-external-link-alt"></i>&nbsp;Read more on&nbsp;<span>BIA</span>FLOWS documentation portal</a>
            </div>
          </div>
        </div>
      </div>
      -->
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
import axios from 'axios';
import {get} from '@/utils/store-helpers';
import {changeLanguageMixin} from '@/lang.js';

import CytomineNavbar from './components/navbar/CytomineNavbar.vue';
import Login from './components/user/Login.vue';

import {Cytomine} from 'cytomine-client';

import constants from '@/utils/constants.js';
import ifvisible from 'ifvisible';
import SandboxWarning from '@/components/utils/SandboxWarning';
ifvisible.setIdleDuration(constants.IDLE_DURATION);

export default {
  name: 'app',
  components: {SandboxWarning, CytomineNavbar, Login},
  mixins: [changeLanguageMixin],
  data() {
    return {
      communicationError: false,
      loading: true,
      timeout: null,
      openedTopMenu: false,
    };
  },
  computed: {
    currentUser: get('currentUser/user'),
    project: get('currentProject/project'),
    host() {
      return constants.CYTOMINE_CORE_HOST;
    },
    videoLink() {
      return constants.VIDEO_LINK;
    },
    instanceName() {
      return constants.INSTANCE_NAME;
    }
  },
  watch: {
    $route() {
      this.openedTopMenu = false;
    }
  },
  methods: {
    async loginGuest() {
      if (constants.TRY_IT_TOKEN) {
        await this.loginWithToken(constants.TRY_IT_USERNAME, constants.TRY_IT_TOKEN);
      }
      else {
        await this.login(constants.TRY_IT_USERNAME, constants.TRY_IT_PASSWORD);
      }
    },

    async login(username, password) {
      try {
        await this.$store.dispatch('currentUser/login', {
          username,
          password,
          rememberMe: true
        });
        if(this.currentUser) {
          this.changeLanguage(this.currentUser.language);
          this.$notify({type: 'success', text: this.$t('notif-success-login')});
        }
        else {
          this.$notify({type: 'error', text: this.$t('notif-unexpected-error')});
        }
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: error.response.data.message});
      }
    },
    async loginWithToken(username, token) {
      try {
        await Cytomine.instance.loginWithToken(username, token);
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
        this.communicationError = false;
      }

      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.ping, constants.PING_INTERVAL);
    },
    async fetchUser() {
      await this.$store.dispatch('currentUser/fetchUser');
      if(this.currentUser) {
        this.changeLanguage(this.currentUser.language);
      }
    },
    openModal() {
      this.$modal.open({
        parent: this,
        component: Login,
        hasModalCard: true
      });
    },
  },
  async created() {
    let Settings;
    await axios
      .get('configuration.json')
      .then(response => (Settings = response.data));

    for(var i in constants){
      if(Settings.hasOwnProperty(i)) {
        constants[i] = Settings[i];
      }
    }
    Object.freeze(constants);

    new Cytomine(constants.CYTOMINE_CORE_HOST);

    if(this.$route.query.token && this.$route.query.username) {
      await this.loginWithToken(this.$route.query.username, this.$route.query.token);
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
  background: #ffffff;
}

.wrapper-scroll {
  overflow-y: auto;
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

.navbar-brand img {
  margin-right: 0.5em;
}
</style>

<style scoped>
footer {
  width: 100%;
}

h1 {
  text-align: left;
}

footer .sponsor {
  max-height: 9rem;
  margin-right: 1rem;
}

.footer {
  padding: 3rem 1.5rem;
}

.video {
  position: relative;
  padding-bottom: 56.25%;
  width: 100%;
}

.column .heading {
  margin-top: 0.25rem;
}

.full-logo {
  height: 12rem;
  margin: 1em;
}

.logo-box {
  margin-top: 3em;
  text-align: center;
}
.video-box {
  margin-top: 12em;
  text-align: center;
}

.biaflows .buttons {
  margin-bottom: 1em;
}

.bg-img {
  background-image: url('assets/bg.svg') ;
  background-position: center center;
  background-repeat:  no-repeat;
  background-attachment: fixed;
  background-size:  cover;
  background-color: #ffffff;
}
</style>
