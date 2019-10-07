<template>
  <div class="table-container">
    <b-loading :is-full-page="false" :active="loading" />
    <table class="table is-fullwidth is-hoverable">
      <thead>
      <tr>
        <th :rowspan="nbHeaderRows">{{$t('analysis')}}</th>
        <th :colspan="nbAggregates" v-for="metric in metrics" :key="metric.id" class="metric-separator">
          {{metric.name}}
        </th>
      </tr>
      <tr v-if="nbHeaderRows === 2">
        <template v-for="n in metrics.length">
          <th v-for="(aggregate, idx) in aggregates" :key="`${n}${aggregate.key}`" :class="{'metric-separator':idx === 0}">
            {{$t(`${aggregate.key}-abbr`)}}
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
              <template v-if="job[`aggregate-metric-${metric.id}`] && job[`aggregate-metric-${metric.id}`][aggregate.key]">
                {{job[`aggregate-metric-${metric.id}`][aggregate.key] | round(3)}}
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
              <template v-if="job[`image-${image.id}-metric-${metric.id}`] && job[`image-${image.id}-metric-${metric.id}`].value">
                {{job[`image-${image.id}-metric-${metric.id}`].value | round(3)}}
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
    loading: {type: Boolean}
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
  }
};
</script>

<style scoped lang="scss">

thead .metric-separator {
  border-left-width: 2px;
}

tbody .metric-separator {
  border-left: 2px solid hsl(0, 0%, 86%);
}
</style>
