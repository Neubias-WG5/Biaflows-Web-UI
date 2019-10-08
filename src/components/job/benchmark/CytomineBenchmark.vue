<template>
  <div v-if="jobs.length > 0 && project.discipline" class="panel">
    <p class="panel-heading">
      {{$t('benchmark')}}
    </p>
    <div class="panel-block">
      <div class="filters">
        <h2>{{$t('filters')}}</h2>
        <div class="columns">
          <div class="column filter is-one-third">
            <div class="filter-label">
              {{$t('images')}}
            </div>
            <div class="filter-body">
              <cytomine-multiselect
                v-model="selectedImages"
                :options="images"
                multiple
                :label="'instanceFilename'"
                track-by="id"
                :allPlaceholder="$t('all-images')"/>
            </div>
          </div>

          <div class="column filter">
            <div class="filter-label">
              {{$t('metrics')}}
            </div>
            <div class="filter-body">
              <cytomine-multiselect
                v-model="selectedMetrics"
                :options="metrics"
                multiple
                track-by="id"
                label="shortName"
                :allPlaceholder="$t('all-metrics')"
              >
                <template #option="{option}">
                   {{option.name}} ({{option.shortName}})
                </template>
              </cytomine-multiselect>
            </div>
          </div>

          <div class="column">
            <div class="filter-label">
              {{$t('aggregate-functions')}}
            </div>
            <div class="filter-body">
              <cytomine-multiselect v-model="selectedAggregates" :options="availableAggregates"
                label="label" track-by="key" multiple />
            </div>
          </div>
        </div>
      </div>

      <div class="no-result has-text-grey" v-if="selectedImages.length === 0 || selectedMetrics.length ===0">
        {{$t('no-result')}}
      </div>
      <b-tabs v-model="currentTab" v-else>
        <b-tab-item :label="$t('aggregated-results')" >
          <benchmark-table
            v-if="selectedAggregates.length > 0"
            :metrics="selectedMetrics"
            :aggregates="selectedAggregates"
            :jobs="formattedJobs"
            :loading="loading"
            @sort="setSort"
            :sort="sort"
          />
          <div class="no-result has-text-grey" v-else>
            {{$t('no-result')}}
          </div>
        </b-tab-item>
        <b-tab-item :label="$t('detailed-results-per-image')">
          <b-collapse class="card" :open="false" v-for="image in selectedImages" :key="`benchmark-image-${image.id}`">
            <template #trigger="{open}" >
              <div class="card-header">
                <p class="card-header-title">
                    <router-link :to="`/project/${project.id}/image/${image.id}`">
                      <img :src="thumbUrl(image)" class="image-overview">
                    </router-link>
                  {{image.instanceFilename}}
                </p>
                <a class="card-header-icon" @click="open = !open">
              <span class="icon">
                <i :class="['fas', open ? 'fa-caret-down' : 'fa-caret-up']"></i>
              </span>
                </a>
              </div>
            </template>
            <div class="card-content">
              <div class="content">
                <benchmark-table
                  :metrics="selectedMetrics"
                  :image="image"
                  :jobs="formattedJobs"
                  :loading="loading"
                  @sort="setSort"
                  :sort="sort"
                />
              </div>
            </div>
          </b-collapse>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import CytomineMultiselect from '@/components/form/CytomineMultiselect';
import {get, sync, syncMultiselectFilter} from '@/utils/store-helpers';
import {ImageInstanceCollection, MetricCollection, MetricResultCollection} from 'cytomine-client';
import {getWildcardRegexp} from '@/utils/string-utils';
import BenchmarkTable from '@/components/job/benchmark/BenchmarkTable';
import constants from '@/utils/constants.js';
import _ from 'lodash';

// store options to use with store helpers to target projects/currentProject/listJobs module
const storeOptions = {rootModuleProp: 'storeModule'};
// redefine helpers to use storeOptions and correct module path
const localSyncMultiselectFilter = (filterName, options) => syncMultiselectFilter(null, filterName, options, storeOptions);

export default {
  name: 'cytomine-benchmark',
  components: {
    BenchmarkTable,
    CytomineMultiselect
  },
  props: [
    'jobs'
  ],
  data() {
    return {
      loading: true,
      error: false,

      images: [],
      metrics: [],

      individualResults: [],
      aggregatedResults: [],
    };
  },
  computed: {
    currentUser: get('currentUser/user'),
    project: get('currentProject/project'),
    configUI: get('currentProject/configUI'),

    storeModule() { // path to the vuex module in which state of this component is stored (projects/currentProject/benchmark)
      return this.$store.getters['currentProject/currentProjectModule'] + 'benchmark';
    },

    selectedImages: localSyncMultiselectFilter('images', 'images'),
    selectedMetrics: localSyncMultiselectFilter('metrics', 'metrics'),
    selectedAggregates: localSyncMultiselectFilter('aggregates', 'availableAggregates'),

    availableAggregates() {
      return [
        {label: this.$t('minimum'), key: 'minimum'},
        {label: this.$t('maximum'), key: 'maximum'},
        {label: this.$t('average'), key: 'average'},
        {label: this.$t('standard-deviation'), key: 'stddev'},
        {label: this.$t('median'), key: 'median'},
      ];
    },

    currentTab: sync('currentTab', storeOptions),
    sort: sync('sort', storeOptions),

    openedImageDetailsStore: get('openedImageDetails', storeOptions),
    openedImageDetails: { // HACK cannot use sync because buefy modifies the property => vuex warning because modif outside store
      get() {
        return this.openedImageDetailsStore.slice();
      },
      set(value) {
        this.$store.commit(this.storeModule + '/setOpenedImageDetails', value);
      }
    },

    availableJobParameters() {
      return [];
    },

    collections() {
      return {
        'individual':
          new MetricResultCollection({
            project: this.project.id,
            images: this.selectedImages.map(image => image.id),
            jobs: this.jobs.map(job => job.id),
          }),
        'aggregate':
          new MetricResultCollection({
            aggregate: true,
            project: this.project.id,
            images: this.selectedImages.map(image => image.id),
            jobs: this.jobs.map(job => job.id),
          })
      };
    },

    formattedJobs() {
      return _.orderBy(this.jobs.map(job => this.formatJob(job)), [this.sort.field], [this.sort.order]);
    }
  },
  watch: {
    collections() {
      this.fetchResults();
    }
  },
  methods: {
    async fetchResults() {
      this.loading = true;

      try {
        this.individualResults = (await this.collections.individual.fetchAll()).array;
        this.aggregatedResults = (await this.collections.aggregate.fetchAll()).array;
      }
      catch(error) {
        console.log(error);
        this.error = true;
        return;
      }

      this.loading = false;
    },
    formatJob(job) {
      this.individualResults.filter(result => result.job === job.id).forEach(result => {
        job[`image-${result.image}-metric-${result.metric}`] = result.value;
      });

      this.aggregatedResults.filter(result => result.job === job.id).forEach(result => {
        this.availableAggregates.forEach(aggregate => {
          job[`aggregate-metric-${result.metric}-${aggregate.key}`] = result[aggregate.key];
        });
      });

      return job;
    },
    async fetchImages() {
      let regexp = getWildcardRegexp('lbl');
      this.images = (await ImageInstanceCollection.fetchAll({
        filterKey: 'project',
        filterValue: this.project.id,
        light: true
      })).array.filter(image => {
        return (image.instanceFilename && !regexp.test(image.instanceFilename))
          || (image.blindedName && !regexp.test(image.blindedName));
      });
    },
    async fetchMetrics() {
      this.metrics = (await MetricCollection.fetchAll({
        filterKey: 'discipline',
        filterValue: this.project.discipline
      })).array;
    },
    thumbUrl(image) {
      return `${constants.CYTOMINE_CORE_HOST}/api/imageinstance/${image.id}/thumb.png?maxSize=512`;
    },
    setSort(field) {
      let order = (this.sort.field === field && this.sort.order === 'asc') ? 'desc' : 'asc';
      this.sort = {field, order};
    }
  },
  async created() {
    try {
      await Promise.all([
        this.fetchImages(),
        this.fetchMetrics(),
        this.fetchResults(),
      ]);
    }
    catch(error) {
      console.log(error);
      this.error = true;
      return;
    }

    this.loading = false;
  }
};
</script>

<style scoped>
.no-result {
  text-align: center;
  margin: 1em;
}

.image-overview {
  max-height: 4rem;
  max-width: 10rem;
  margin-right: 1rem;
}

>>> .card-content {
  padding-left: 0;
  padding-right: 0;
}
</style>
