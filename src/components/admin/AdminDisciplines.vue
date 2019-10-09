<template>
  <div>
    <b-loading :is-full-page="false" :active="loading" />
    <template v-if="!loading">
      <b-message v-if="!disciplines" type="is-danger" has-icon icon-size="is-small">
        <h2> {{ $t('error') }} </h2>
        <p> {{ $t('unexpected-error-info-message') }} </p>
      </b-message>
      <template v-else>
        <div class="columns">
          <div class="column is-one-quarter">
            <b-input v-model="searchString" :placeholder="$t('search-placeholder')" type="search" icon="search" />
          </div>

          <div class="column is-one-half has-text-right-desktop">
            <button class="button is-link" @click="startDisciplineCreation()">
              {{$t('button-new-discipline')}}
            </button>
          </div>
        </div>

        <b-table
          :data="filteredDisciplines"
          :paginated="true"
          :per-page="perPage"
          pagination-size="is-small"
        >

          <template #default="{row: discipline}">

            <b-table-column field="name" sortable :label="$t('name')" width="150">
              {{discipline.name}}
            </b-table-column>

            <b-table-column field="shortName" sortable :label="$t('short-name')" width="50">
              {{discipline.shortName}}
            </b-table-column>

            <b-table-column label="" width="50">
              <div class="buttons">
                <button class="button is-link is-small" @click="startDisciplineEdition(discipline)">
                  {{$t('button-edit')}}
                </button>
              </div>
            </b-table-column>
          </template>

          <template #empty>
            <div class="content has-text-grey has-text-centered">
              <p>{{$t('no-discipline-fitting-criteria')}}</p>
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

        <discipline-modal :active.sync="modal" :discipline="editedDiscipline" @addDiscipline="addDiscipline" @updateDiscipline="updateDiscipline" />
      </template>
    </template>
  </div>
</template>

<script>
import {DisciplineCollection} from 'cytomine-client';
import DisciplineModal from './DisciplineModal';
import {getWildcardRegexp} from '@/utils/string-utils';
import CytomineDescription from '@/components/description/CytomineDescription';

export default {
  name: 'admin-disciplines',
  components: {
    CytomineDescription,
    DisciplineModal,
  },
  data() {
    return {
      loading: true,
      disciplines: null,
      addDisciplineModal: false,
      searchString: '',
      perPage: 25,
      modal: false,
      editedDiscipline: null
    };
  },
  computed: {
    regexp() {
      return getWildcardRegexp(this.searchString);
    },
    filteredDisciplines() {
      if(!this.searchString) {
        return this.disciplines;
      }

      return this.disciplines.filter(ts => this.regexp.test(ts.name) || this.regexp.test(ts.shortName));
    }
  },
  methods: {
    startDisciplineCreation() {
      this.editedDiscipline = null;
      this.modal = true;
    },
    addDiscipline(discipline) {
      this.disciplines.push(discipline);
    },
    startDisciplineEdition(discipline) {
      this.editedDiscipline = discipline;
      this.modal = true;
    },
    updateDiscipline(discipline) {
      this.editedDiscipline.populate(discipline);
    },
    findDiscipline(id) {
      return this.disciplines.find(discipline => discipline.id === id);
    },
  },
  async created() {
    try {
      this.disciplines = (await DisciplineCollection.fetchAll()).array;
    }
    catch(error) {
      console.log(error);
    }
    this.loading = false;
  }
};
</script>
