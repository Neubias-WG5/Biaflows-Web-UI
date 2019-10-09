<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <b-message v-if="!metrics" type="is-danger" has-icon icon-size="is-small">
        <h2> {{ $t('error') }} </h2>
        <p> {{ $t('unexpected-error-info-message') }} </p>
      </b-message>
      <template v-else>
        <div class="columns">
          <div class="column is-one-quarter">
            <b-input v-model="searchString" :placeholder="$t('search-placeholder')" type="search" icon="search" />
          </div>

          <div class="column is-one-half has-text-right-desktop">
            <button class="button is-link" @click="startMetricCreation()">
              {{$t('button-new-metric')}}
            </button>
          </div>
        </div>

        <b-table
          :data="filteredMetrics"
          :paginated="true"
          :per-page="perPage"
          pagination-size="is-small"
          detailed
          detail-key="id"
        >

          <template #default="{row: metric}">

            <b-table-column field="name" sortable :label="$t('name')" width="150">
              {{metric.name}}
            </b-table-column>

            <b-table-column field="shortName" sortable :label="$t('short-name')" width="50">
              {{metric.shortName}}
            </b-table-column>

            <b-table-column field="disciplines" sortable :label="$t('disciplines')" width="150">
              <template v-if="metric.disciplines && metric.disciplines.length">
                <span v-for="(discipline, index) in metric.disciplines" :key="discipline.id">
                  {{findDiscipline(discipline).name}}<span v-if="index < metric.disciplines.length - 1">, </span>
                </span>
              </template>
            </b-table-column>

            <b-table-column label="" width="50">
              <div class="buttons">
                <button class="button is-link is-small" @click="startMetricEdition(metric)">
                  {{$t('button-edit')}}
                </button>
              </div>
            </b-table-column>
          </template>

          <template #detail="{row: metric}">
            <table class="table">
              <tbody>
              <tr>
                <td class="prop-label">{{$t('description')}}</td>
                <td class="prop-content">
                  <cytomine-description :object="metric" />
                </td>
              </tr>
<!--              <tr>-->
<!--                <td class="prop-label">{{$t('actions')}}</td>-->
<!--                <td class="prop-content">-->
<!--                  <button class="button is-danger is-small" @click="deleteMetric(metric)">-->
<!--                    {{$t('button-delete')}}-->
<!--                  </button>-->
<!--                </td>-->
<!--              </tr>-->
              </tbody>
            </table>
          </template>

          <template #empty>
            <div class="content has-text-grey has-text-centered">
              <p>{{$t('no-metric-fitting-criteria')}}</p>
            </div>
          </template>

          <template #bottom-left>
            <b-select v-model="perPage" size="is-small">
              <option value="10">{{$t('count-per-page', {count: 10})}}</option>
              <option value="25">{{$t('count-per-page', {count: 25})}}</option>
              <option value="50">{{$t('count-per-page', {count: 50})}}</option>
              <option value="100">{{$t('count-per-page', {count: 100})}}</option>
            </b-select>
          </template>
        </b-table>

        <metric-modal :active.sync="modal" :metric="editedMetric" @addMetric="addMetric" @updateMetric="updateMetric" />
      </template>
    </template>
  </div>
</template>

<script>
import {MetricCollection, DisciplineCollection} from 'cytomine-client';
import MetricModal from './MetricModal';
import {getWildcardRegexp} from '@/utils/string-utils';
import CytomineDescription from '@/components/description/CytomineDescription';

export default {
  name: 'admin-metrics',
  components: {
    CytomineDescription,
    MetricModal,
  },
  data() {
    return {
      loading: true,
      metrics: null,
      disciplines: null,
      addMetricModal: false,
      searchString: '',
      perPage: 25,
      modal: false,
      editedMetric: null
    };
  },
  computed: {
    regexp() {
      return getWildcardRegexp(this.searchString);
    },
    filteredMetrics() {
      if(!this.searchString) {
        return this.metrics;
      }

      return this.metrics.filter(ts => this.regexp.test(ts.name) || this.regexp.test(ts.shortName));
    }
  },
  methods: {
    startMetricCreation() {
      this.editedMetric = null;
      this.modal = true;
    },
    addMetric(metric) {
      this.metrics.push(metric);
    },
    startMetricEdition(metric) {
      this.editedMetric = metric;
      this.modal = true;
    },
    updateMetric(metric) {
      this.editedMetric.populate(metric);
    },
    findDiscipline(id) {
      return this.disciplines.find(discipline => discipline.id === id);
    },

    // confirmDeletion(metric) {
    //   this.$dialog.confirm({
    //     title: this.$t('delete-metric'),
    //     message: this.$t('delete-metric-confirmation-message', {metricName: metric.name}),
    //     type: 'is-danger',
    //     confirmText: this.$t('button-confirm'),
    //     cancelText: this.$t('button-cancel'),
    //     onConfirm: this.deleteMetric(metric)
    //   });
    // },
    // async deleteMetric() {
    //   try {
    //     await Metric.delete(this.metric.id);
    //     this.$notify({
    //       type: 'success',
    //       text: this.$t('notif-success-metric-deletion', {metricName: metric.name})
    //     });
    //   }
    //   catch(err) {
    //     console.log(err);
    //     this.$notify({
    //       type: 'error',
    //       text: this.$t('notif-error-metric-deletion', {metricName: metric.name})
    //     });
    //   }
    // },
  },
  async created() {
    try {
      this.metrics = (await MetricCollection.fetchAll()).array;
      this.disciplines = (await DisciplineCollection.fetchAll()).array;
    }
    catch(error) {
      console.log(error);
    }
    this.loading = false;
  }
};
</script>
