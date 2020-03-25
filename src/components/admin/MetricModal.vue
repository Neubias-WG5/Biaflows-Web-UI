<template>
  <form @submit.prevent="save()">
    <cytomine-modal :active="active" :title="title" @close="$emit('update:active', false)">
      <b-field
        v-for="{field, validationRules} in editableFields"
        :key="field"
        :label="$t(fieldLabels[field])"
        horizontal
        :type="{'is-danger': errors.has(field)}"
        :message="errors.first(field)"
      >
        <b-input
          v-if="field !== 'main'"
          v-model="internalMetric[field]"
          :name="field"
          v-validate="validationRules"
          type="text"
        />
        <b-checkbox
          v-else
          v-model="internalMetric[field]"
          :name="field"
        />
      </b-field>

      <b-field :label="$t('disciplines')" horizontal>
        <b-select v-model="selectedDisciplines" multiple expanded>
          <option v-for="discipline in disciplines" :value="discipline.id" :key="discipline.id">
            {{discipline.name}}
          </option>
        </b-select>
      </b-field>

      <template #footer>
        <button class="button" type="button" @click="$emit('update:active', false)">
          {{$t('button-cancel')}}
        </button>
        <button class="button is-link" :disabled="errors.any()">
          {{$t('button-save')}}
        </button>
      </template>
    </cytomine-modal>
  </form>
</template>

<script>
import {Metric, DisciplineCollection} from 'cytomine-client';
import CytomineModal from '@/components/utils/CytomineModal';

export default {
  name: 'metric-modal',
  props: {
    active: Boolean,
    metric: Object
  },
  components: {CytomineModal},
  $_veeValidate: {validator: 'new'},
  data() {
    return {
      internalMetric: {},
      selectedDisciplines: [],
      disciplines: null,
      displayErrors: false
    };
  },
  computed: {
    editionMode() {
      return Boolean(this.metric);
    },
    title() {
      return this.$t(this.editionMode ? 'update-metric' : 'create-metric');
    },
    editableFields() {
      return [
        {field: 'name', validationRules: 'required'},
        {field: 'shortName', validationRules: 'required'},
        {field: 'main', validationRules: ''}
      ];
    },
    fieldLabels() {
      return {
        'name': 'name',
        'shortName': 'short-name',
        'main': 'main-metric'
      };
    }
  },
  watch: {
    active(val) {
      if(val) {
        if(!this.disciplines) {
          this.$notify({type: 'error', text: this.$t('notif-unexpected-error')});
          this.$emit('update:active', false);
          return;
        }
        this.internalMetric = this.metric ? this.metric.clone() : new Metric();
        this.selectedDisciplines = (this.metric && this.metric.disciplines) ? this.metric.disciplines : [];
        this.displayErrors = false;
      }
    }
  },
  methods: {
    async save() {
      let result = await this.$validator.validateAll();
      if(!result) {
        return;
      }

      let labelTranslation = this.editionMode ? 'update' : 'creation';

      try {
        this.internalMetric.disciplines = this.selectedDisciplines.slice();
        console.log(this.internalMetric.disciplines);
        await this.internalMetric.save();
        this.$notify({type: 'success', text: this.$t('notif-success-metric-' + labelTranslation)});
        this.$emit('update:active', false);
        this.$emit(this.editionMode ? 'updateMetric' : 'addMetric', this.internalMetric);
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t('notif-error-metric-' + labelTranslation)});
      }
    },
  },
  async created() {
    try {
      this.disciplines = (await DisciplineCollection.fetchAll()).array;
    }
    catch(error) {
      console.log(error);
    }
  }
};
</script>

<style scoped>
  .hidden {
    display: none;
  }

  >>> .modal-card, >>> .modal-card-body {
    width: 100vw;
    max-width: 800px;
  }
</style>
