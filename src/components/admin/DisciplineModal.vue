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
          v-model="internalDiscipline[field]"
          :name="field"
          v-validate="validationRules"
          type="text"
        />
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
import {Discipline, DisciplineCollection} from 'cytomine-client';
import CytomineModal from '@/components/utils/CytomineModal';

export default {
  name: 'discipline-modal',
  props: {
    active: Boolean,
    discipline: Object
  },
  components: {CytomineModal},
  $_veeValidate: {validator: 'new'},
  data() {
    return {
      internalDiscipline: {},
      displayErrors: false
    };
  },
  computed: {
    editionMode() {
      return Boolean(this.discipline);
    },
    title() {
      return this.$t(this.editionMode ? 'update-discipline' : 'create-discipline');
    },
    editableFields() {
      return [
        {field: 'name', validationRules: 'required'},
        {field: 'shortName', validationRules: 'required'},
      ];
    },
    fieldLabels() {
      return {
        'name': 'name',
        'shortName': 'short-name',
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
        this.internalDiscipline = this.discipline ? this.discipline.clone() : new Discipline();
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
        await this.internalDiscipline.save();
        this.$notify({type: 'success', text: this.$t('notif-success-discipline-' + labelTranslation)});
        this.$emit('update:active', false);
        this.$emit(this.editionMode ? 'updateDiscipline' : 'addDiscipline', this.internalDiscipline);
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t('notif-error-discipline-' + labelTranslation)});
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
