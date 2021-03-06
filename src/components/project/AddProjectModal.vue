<template>
<form @submit.prevent="createProject()">
  <cytomine-modal :active="active" :title="$t('create-project')" @close="$emit('update:active', false)">
    <b-field :label="$t('name')" :type="{'is-danger': errors.has('name')}" :message="errors.first('name')">
      <b-input v-model="name" name="name" v-validate="'required'" />
    </b-field>

<!--    <b-field :label="$t('ontology')">-->
<!--      <b-radio v-model="ontology" native-value="NEW">-->
<!--        {{$t('create-ontology-for-project')}}-->
<!--      </b-radio>-->
<!--    </b-field>-->
<!--    <b-field>-->
<!--      <b-radio v-model="ontology" native-value="EXISTING">-->
<!--        {{$t('use-existing-ontology')}}-->
<!--      </b-radio>-->
<!--    </b-field>-->
<!--    <b-field>-->
<!--      <b-radio v-model="ontology" native-value="NO">-->
<!--        {{$t('no-ontology')}}-->
<!--      </b-radio>-->
<!--    </b-field>-->

    <template v-if="ontology === 'EXISTING'">
      <b-field :type="{'is-danger': errors.has('ontology')}" :message="errors.first('ontology')">
        <b-select
          size="is-small"
          v-model="selectedOntology"
          :placeholder="$t('select-ontology')"
          name="ontology"
          v-validate="'required'"
        >
          <option v-for="ontology in ontologies" :value="ontology.id" :key="ontology.id">
            {{ontology.name}}
          </option>
        </b-select>
      </b-field>
    </template>

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
import {Project, Ontology, OntologyCollection} from 'cytomine-client';
import CytomineModal from '@/components/utils/CytomineModal';

export default {
  name: 'add-project-modal',
  props: {
    active: Boolean
  },
  components: {CytomineModal},
  $_veeValidate: {validator: 'new'},
  data() {
    return {
      name: '',
      ontology: 'NEW',
      ontologies: [],
      selectedOntology: null
    };
  },
  watch: {
    active(val) {
      if(val) {
        this.name = '';
        this.ontology = 'NEW';
        this.selectedOntology = null;
      }
    }
  },
  methods: {
    async createProject() {
      let result = await this.$validator.validateAll();
      if(!result) {
        return;
      }

      try {
        let idOntology;
        if(this.ontology === 'NEW') {
          let ontology = await new Ontology({name: this.name}).save();
          idOntology = ontology.id;
        }
        else if(this.ontology === 'EXISTING') {
          idOntology = this.selectedOntology;
        }

        let project = await new Project({name: this.name, ontology: idOntology, isRestricted: true}).save();
        this.$notify({type: 'success', text: this.$t('notif-success-project-creation')});
        this.$router.push(`/project/${project.id}/configuration`);
      }
      catch(error) {
        console.log(error);
        this.$notify({type: 'error', text: this.$t('notif-error-project-creation')});
      }
    }
  },
  async created() {
    this.ontologies = (await OntologyCollection.fetchAll({light: true})).array;
    this.ontologies.sort((a, b) => a.name.localeCompare(b.name));
  }
};
</script>
