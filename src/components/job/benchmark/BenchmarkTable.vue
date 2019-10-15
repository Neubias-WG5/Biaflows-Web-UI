<template>
  <div class="table-container">
    <b-loading :is-full-page="false" :active="loading" />
    <table class="table is-fullwidth is-hoverable">
      <thead>
      <tr class="is-vcentered">
        <th :rowspan="nbHeaderRows">{{$t('analysis')}}</th>
        <th
          :colspan="nbAggregates"
          v-for="metric in metrics" :key="metric.id"
          class="metric-separator"
          :class="{'is-sortable': !showAggregates, 'is-current-sort': !showAggregates && sort.field === `image-${image.id}-metric-${metric.id}`}"
          @click.stop="sortByImage(metric)"
        >
          <span v-if="metric.description && showAggregates">
            <v-popover>
              <i class="fas fa-info-circle"></i>
              <template #popover>
                <p v-html="metric.description"></p>
              </template>
            </v-popover>
          </span>
          {{metric.name}}
          <span class="is-small icon" v-if="!showAggregates">
              <i
                class="fas fa-arrow-up"
                v-if="sort.field === `image-${image.id}-metric-${metric.id}`"
                :class="{'is-desc': sort.order === 'desc'}"
              ></i>
              <i class="fas fa-sort sort-unset" v-else></i>
            </span>
        </th>
      </tr>
      <tr v-if="nbHeaderRows === 2">
        <template v-for="metric in metrics">
          <th
            v-for="(aggregate, idx) in aggregates"
            :key="`${metric.id}-${aggregate.key}`"
            :class="{'metric-separator': idx === 0, 'is-current-sort': sort.field === `aggregate-metric-${metric.id}-${aggregate.key}`}"
            class="is-sortable"
            @click.stop="$emit('sort', `aggregate-metric-${metric.id}-${aggregate.key}`)"
          >
            {{$t(`${aggregate.key}-abbr`)}}
            <span class="is-small icon">
              <i
                class="fas fa-arrow-up"
                v-if="sort.field === `aggregate-metric-${metric.id}-${aggregate.key}`"
                :class="{'is-desc': sort.order === 'desc'}"
              ></i>
              <i class="fas fa-sort sort-unset" v-else></i>
            </span>
          </th>
        </template>
      </tr>
      </thead>
      <tbody>
      <tr v-for="job in jobs" :key="`benchmark-aggregate-${job.id}`">
        <td>
          <i class="fas fw fa-star" v-if="job.favorite"></i>&nbsp;{{job.softwareName}}
          #{{job.number}} {{$t('on')}} {{Number(job.created) | moment('ll LT')}}
        </td>
        <template v-for="metric in metrics">
          <template v-if="showAggregates">
            <td
              v-for="(aggregate, idx) in aggregates"
              :key="`benchmark-aggregate-${job.id}-${metric.id}-${aggregate.key}`"
              :class="{'metric-separator':idx === 0}"
            >
              <template v-if="job[`aggregate-metric-${metric.id}-${aggregate.key}`] !== undefined">
                {{job[`aggregate-metric-${metric.id}-${aggregate.key}`] | round(3)}}
              </template>
              <span class="has-text-grey" v-else>
                *
              </span>
            </td>
          </template>
          <template v-else>
            <td
              :key="`benchmark-image-metric-${job.id}-${image.id}-${metric.id}`"
              class="metric-separator"
            >
              <template v-if="job[`image-${image.id}-metric-${metric.id}`] !== undefined">
                {{job[`image-${image.id}-metric-${metric.id}`] | round(3)}}
              </template>
              <span class="has-text-grey" v-else>
                *
              </span>
            </td>
          </template>

        </template>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'benchmark-table',
  props: {
    jobs: {type: Array},
    metrics: {type: Array},
    aggregates: {type: Array, default: () => []},
    image: {type: Object, default: null},
    parameters: {type: Array, default: () => []},
    loading: {type: Boolean},
    sort: {type: Object}
  },
  computed: {
    nbAggregates() {
      return this.aggregates.length;
    },
    showAggregates() {
      return this.image === null;
    },
    nbHeaderRows() {
      return (this.showAggregates) ? 2 : 1;
    }
  },
  methods: {
    sortByImage(metric) {
      if (!this.image) {
        return;
      }

      this.$emit('sort', `image-${this.image.id}-metric-${metric.id}`);
    }
  }
};
</script>

<style scoped>

thead .metric-separator {
  border-left-width: 2px;
}

thead th {
  vertical-align: middle;
}

tbody .metric-separator {
  border-left: 2px solid hsl(0, 0%, 86%);
}

.is-sortable {
  cursor: pointer;
}

.is-sortable:hover {
  border-bottom-color: #7a7a7a;
}

.is-current-sort {
  border-bottom-color: #7a7a7a;
}

.is-sortable .icon .sort-unset {
  color: rgba(0, 0, 0, 0.2);
}

th .icon {
  margin-right: 0;
  font-size: 1rem;
  transition: transform 150ms ease-out, opacity 86ms ease-out;
}

.icon .is-desc {
  transform: rotate(180deg);
}
</style>
