<template>
<div class="project-actions-wrapper">
  <rename-modal
    :title="$t('rename-project')"
    :currentName="project.name"
    :active.sync="isRenameModalActive"
    @rename="rename"
  />

  <form @submit.prevent="saveOntology()">
    <cytomine-modal :active="isOntologyModalActive" :title="$t('change-ontology')" @close="isOntologyModalActive = false">
      <b-message v-if="errorOntologies" type="is-danger" has-icon icon-size="is-small">
        <h2> {{ $t('error') }} </h2>
        <p> {{ $t('unexpected-error-info-message') }} </p>
      </b-message>
      <template v-else>
        <b-message v-if="project.ontology" type="is-warning" has-icon icon-size="is-small">
          {{$t('change-ontology-warning-message')}}
        </b-message>
        <b-field :label="$t('ontology')">
          <b-select
            v-model="selectedOntology"
            :placeholder="$t('no-ontology')"
            :disabled="loadingOntologies"
            :loading="loadingOntologies"
          >
            <option :value="null">
              {{$t('no-ontology')}}
            </option>
            <option v-for="ontology in ontologies" :value="ontology.id" :key="ontology.id">
              {{ontology.name}}
            </option>
          </b-select>
        </b-field>
      </template>

      <template #footer>
        <button
          class="button"
          type="button"
          @click="isOntologyModalActive = false"
          :disabled="savingOntology"
        >
          {{$t('button-cancel')}}
        </button>
        <button
          v-if="!errorOntologies"
          class="button is-link"
          :class="{'is-loading': savingOntology}"
          :disabled="loadingOntologies || savingOntology"
        >
          {{$t('button-save')}}
        </button>
      </template>
    </cytomine-modal>
  </form>

  <form @submit.prevent="saveDiscipline()">
    <cytomine-modal :active="isDisciplineModalActive" :title="$t('change-discipline')" @close="isDisciplineModalActive = false">
      <b-message v-if="errorDisciplines" type="is-danger" has-icon icon-size="is-small">
        <h2> {{ $t('error') }} </h2>
        <p> {{ $t('unexpected-error-info-message') }} </p>
      </b-message>
      <template v-else>
        <b-field :label="$t('discipline')">
          <b-select
            v-model="selectedDiscipline"
            :placeholder="$t('no-discipline')"
            :disabled="loadingDisciplines"
            :loading="loadingDisciplines"
          >
            <option :value="null">
              {{$t('no-discipline')}}
            </option>
            <option v-for="discipline in disciplines" :value="discipline.id" :key="discipline.id">
              {{discipline.name}}
            </option>
          </b-select>
        </b-field>
      </template>

      <template #footer>
        <button
          class="button"
          type="button"
          @click="isDisciplineModalActive = false"
        >
          {{$t('button-cancel')}}
        </button>
        <button
          v-if="!errorDisciplines"
          class="button is-link"
          :disabled="loadingDisciplines"
        >
          {{$t('button-save')}}
        </button>
      </template>
    </cytomine-modal>
  </form>

  <div class="buttons">
    <button class="button" :class="size" @click="isRenameModalActive = true">
      {{$t('button-rename')}}
    </button>
    <button class="button" :class="size" @click="isOntologyModalActive = true" :disabled="cannotDeleteOntology">
      {{$t('button-change-ontology')}}
    </button>
    <button class="button" :class="size" @click="isDisciplineModalActive = true">
      {{$t('button-change-discipline')}}
    </button>
    <button class="button is-danger" :class="size" @click="deleteProject()">
      {{$t('button-delete')}}
    </button>
  </div>
</div>
</template>

<script>
import {OntologyCollection, DisciplineCollection} from 'cytomine-client';
import CytomineModal from '@/components/utils/CytomineModal';
import RenameModal from '@/components/utils/RenameModal';

export default {
  name: 'project-actions',
  props: {
    project: {type: Object},
    size: {type: String, default: 'is-small'}
  },
  components: {
    CytomineModal,
    RenameModal
  },
  data() {
    return {
      isRenameModalActive: false,
      isOntologyModalActive: false,
      isDisciplineModalActive: false,

      loadingOntologies: true,
      errorOntologies: false,
      ontologies: null,
      selectedOntology: null,
      cannotDeleteOntology: false,
      savingOntology: false,

      loadingDisciplines: true,
      errorDisciplines: false,
      disciplines: null,
      selectedDiscipline: null,
      cannotDeleteDiscipline: false,
    };
  },
  watch: {
    async isOntologyModalActive(val) {
      if(val) {
        if(this.loadingOntologies) { // first opening of the ontology modal => load ontologies
          try {
            this.ontologies = (await OntologyCollection.fetchAll({light: true})).array;
            this.ontologies.sort((a, b) => a.name.localeCompare(b.name));
            this.loadingOntologies = false;
          }
          catch(error) {
            console.log(error);
            this.errorOntologies = true;
          }
        }

        // preselect the ontology of the project
        this.selectedOntology = this.project.ontology;
        this.savingOntology = false;
      }
    },

    async isDisciplineModalActive(val) {
      if(val) {
        if(this.loadingDisciplines) {
          try {
            this.disciplines = (await DisciplineCollection.fetchAll()).array;
            this.disciplines.sort((a, b) => a.name.localeCompare(b.name));
            this.loadingDisciplines = false;
          }
          catch(error) {
            console.log(error);
            this.errorDisciplines = true;
          }
        }

        // preselect the discipline of the project
        this.selectedDiscipline = this.project.discipline;
      }
    },
  },
  methods: {
    async rename(newName) {
      let updatedProject = this.project.clone();
      try {
        updatedProject.name = newName;
        await updatedProject.save();
        this.$emit('update', updatedProject);
        this.$notify({
          type: 'success',
          text: this.$t('notif-success-project-rename', {projectName: updatedProject.name})
        });
      }
      catch(error) {
        console.log(error);
        this.$notify({
          type: 'error',
          text: this.$t('notif-error-project-rename', {projectName: this.project.name})
        });
      }
      this.isRenameModalActive = false;
    },

    async saveOntology(forceOntologyUpdate=false) {
      this.savingOntology = true; // possibly long operation => give user visual indication that it is in progress
      let updatedProject = this.project.clone();
      try {
        updatedProject.ontology = this.selectedOntology;
        updatedProject.forceOntologyUpdate = forceOntologyUpdate; // to delete annotationterms if some exist
        await updatedProject.save();
        this.$emit('update', updatedProject);
        this.$notify({
          type: 'success',
          text: this.$t('notif-success-project-ontology-change', {projectName: this.project.name})
        });
      }
      catch(error) {
        console.log(error);
        if(error.response && error.response.data.errorValues) {
          let counts = error.response.data.errorValues;

          // if the only terms associations are performed by users, ask confirmation and delete them
          if(counts.algoAssociatedTermsCount === 0 && counts.reviewedAssociatedTermsCount === 0) {
            this.$dialog.confirm({
              title: this.$t('confirm-ontology-change'),
              message: this.$t('confirm-ontology-change-delete-user-terms', {count: counts.userAssociatedTermsCount}),
              type: 'is-danger',
              confirmText: this.$t('button-confirm'),
              cancelText: this.$t('button-cancel'),
              onConfirm: () => this.saveOntology(true)
            });
          }
          else { // otherwise, backend does not allow automatic deletion => notify of error
            this.cannotDeleteOntology = true;
            this.$notify({
              type: 'error',
              text: this.$t('notif-error-project-ontology-change-' +
                                (counts.algoAssociatedTermsCount ? 'job-terms' : 'reviewed-terms'))
            });
          }
        }
        else {
          this.$notify({
            type: 'error',
            text: this.$t('notif-error-project-ontology-change', {projectName: this.project.name})
          });
        }
      }
      this.savingOntology = false;
      this.isOntologyModalActive = false;
    },

    async saveDiscipline() {
      let updatedProject = this.project.clone();
      try {
        updatedProject.discipline = this.selectedDiscipline;
        await updatedProject.save();
        this.$emit('update', updatedProject);
        this.$notify({
          type: 'success',
          text: this.$t('notif-success-project-discipline-change', {projectName: this.project.name})
        });
      }
      catch(error) {
        console.log(error);
        this.$notify({
          type: 'error',
          text: this.$t('notif-error-project-discipline-change', {projectName: this.project.name})
        });
      }
      this.isDisciplineModalActive = false;
    },

    deleteProject() {
      this.$dialog.confirm({
        title: this.$t('delete-project'),
        message: this.$t('delete-project-confirmation-message', {projectName: this.project.name}),
        type: 'is-danger',
        confirmText: this.$t('button-confirm'),
        cancelText: this.$t('button-cancel'),
        onConfirm: () => this.$emit('delete')
      });
    }
  }
};
</script>
