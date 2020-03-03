<template>
<cytomine-modal-card :title="$t('about-cytomine')" @close="$parent.close()">
  <template v-if="!loading">
    <dl>
      <dt>{{$t('version')}}</dt>
      <dd>{{version || '?'}}</dd>

      <dt>{{$t('sponsors')}}</dt>
      <dd>
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
      </dd>

      <dt>{{$t('description')}}</dt>
      <dd>
        <i18n path="cytomine-sponsors-info">
          <a place="cytomineCompanyLink" href="https://cytomine.coop" target="_blank">
            {{$t('cytomine-company')}}</a>
        </i18n>
      </dd>

<!--      <dt>{{$t('website')}}</dt>-->
<!--      <dd>-->
<!--        <i18n path="cytomine-website-info">-->
<!--          <a place="websiteLink" href="https://cytomine.coop" target="_blank">cytomine.org</a>-->
<!--        </i18n>-->
<!--      </dd>-->

      <dt>{{$t('source-code')}}</dt>
      <dd>
        <i18n path="source-code-info">
          <a place="githubLink" href="https://github.com/neubias-wg5/" target="_blank">
            {{$t('github-repository')}}</a>
          <a place="githubLink1" href="http://github.com/cytomine-uliege/" target="_blank">
            {{$t('here')}}</a>
          <a place="githubLink2" href="http://github.com/cytomine/" target="_blank">
            {{$t('here')}}</a>
        </i18n>
      </dd>

      <dt>{{$t('documentation')}}</dt>
      <dd>
        <i18n path="documentation-info">
          <a place="docLink" href="https://neubias-wg5.github.io" target="_blank">{{$t('here')}}</a>
        </i18n>
      </dd>

      <dt>Project leaders</dt>
      <dd>
        <ul>
          <li>Sébastien Tosi</li>
          <li>Raphaël Marée</li>
        </ul>
      </dd>

      <dt>Main developers</dt>
      <dd>
        <ul>
          <li>Ulysse Rubens</li>
          <li>Romain Mormont</li>
          <li>Volker Baecker</li>
          <li>Lassi Paavolainen</li>
          <li>Benjamin Pavie</li>
          <li>Renaud Hoyoux</li>
        </ul>
      </dd>

      <dt>Contributors</dt>
      <dd>
        <ul>
          <li>Gino Michiels</li>
          <li>Graeme Ball</li>
          <li>Devrim Unay</li>
          <li>Anatole Chessel</li>
          <li>Leandro A. Scholz</li>
          <li>Martin Maska</li>
          <li>Rémy Vandaele</li>
          <li>Stefan G. Stanciu</li>
          <li>Ofra Golani</li>
          <li>Natasa Sladoje</li>
          <li>Perrine Paul-Gilloteaux</li>
        </ul>
      </dd>

      <dt>{{$t('contact')}}</dt>
      <dd>
        <i18n path="contact-info">
          <a place="contactMail" href="mailto:biaflows@neubias.org">biaflows@neubias.org</a>
        </i18n>
      </dd>
    </dl>
  </template>
</cytomine-modal-card>
</template>

<script>
import {Cytomine} from 'cytomine-client';
import constants from '@/utils/constants.js';
import CytomineModalCard from '@/components/utils/CytomineModalCard';

export default {
  name: 'about-cytomine-wrapper',
  components: {CytomineModalCard},
  data() {
    return {
      version: null,
      loading: true
    };
  },
  computed: {
    apiDocLink() {
      let core = constants.CYTOMINE_CORE_HOST;
      return `${core}/restApiDoc/?doc_url=${core}/restApiDoc/api`;
    }
  },
  async created() {
    try {
      let {version} = await Cytomine.instance.ping();
      this.version = version;
    }
    catch(error) {
      console.log(error);
    }
    this.loading = false;
  }
};
</script>

<style scoped>
.modal-card, .modal-card-body {
  width: 50vw;
  min-width: 700px;
  font-weight: normal;
}

dt {
  float: left;
  width: 12rem;
  text-align: right;
  padding-right: 1rem;
  clear: both;
  font-weight: 600;
}

dd {
  margin-left: 14rem;
  background-color: #fff;
  margin-bottom: 0.75rem;
}

img.sponsor {
  max-height: 7rem;
  margin-right: 1rem;
}
</style>
