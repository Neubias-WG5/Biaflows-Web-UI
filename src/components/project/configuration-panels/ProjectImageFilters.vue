<template>
<div class="project-image-filters-wrapper">
    <b-loading :is-full-page="false" :active="loading"></b-loading>
    <template v-if="!loading">
        <b-input class="search-field" v-model="searchString" :placeholder="$t('search-placeholder')" type="search" icon="search" />

        <b-table :data="filteredImageFilters"
                default-sort="selected"
                default-sort-direction="desc"
                :paginated="true"
                :per-page="perPage"
                pagination-size="is-small">

            <template slot-scope="{row: filter}">
                <b-table-column field="name" :label="$t('name')" sortable>
                    {{filter.name}}
                </b-table-column>

                <b-table-column field="selected" :label="$t('status')" sortable>
                    <button :class="['button', filter.selected ? 'is-success' : 'is-danger']"
                            @click="toggleFilter(filter)">
                        {{$t(filter.selected ? "enabled" : "disabled")}}
                    </button>
                </b-table-column>
            </template>

            <template slot="empty">
                <div class="content has-text-grey has-text-centered">
                    <p>{{$t("no-image-filter")}}</p>
                </div>
            </template>

            <template slot="bottom-left">
                <b-select v-model="perPage" size="is-small">
                    <option value="10">10 {{$t("per-page")}}</option>
                    <option value="25">25 {{$t("per-page")}}</option>
                    <option value="50">50 {{$t("per-page")}}</option>
                    <option value="100">100 {{$t("per-page")}}</option>
                </b-select>
            </template>
        </b-table>
    </template>
</div>
</template>

<script>
import {ImageFilterCollection, ImageFilterProject, ImageFilterProjectCollection} from "cytomine-client";

export default {
    name: "project-image-filters",
    data() {
        return {
            loading: true,

            searchString: "",
            perPage: 10,

            imageFilters: []
        };
    },
    computed: {
        project() {
            return this.$store.state.project.project;
        },

        filteredImageFilters() {
            let str = this.searchString.toLowerCase();
            return this.imageFilters.filter(imgFilter => imgFilter.name.toLowerCase().indexOf(str) >= 0);
        }
    },
    methods: {
        async toggleFilter(filter) {
            try {
                if(filter.selected) {
                    await filter.imageFilterProject.delete();
                    filter.selected = false;
                }
                else {
                    let filterProject = await new ImageFilterProject({
                        imageFilter: filter.id, 
                        project: this.project.id
                    }).save();
                    filter.imageFilterProject = filterProject;
                    filter.selected = true;
                }
            }
            catch(error) {
                console.log(error);
                this.$notify({
                    type: "error",
                    text: this.$t("notif-error-change-status-image-filter-project", {filterName: filter.name})
                });
            }
        }
    },
    async created() {
        let promiseFilters = ImageFilterCollection.fetchAll();
        let promiseFiltersProjects = ImageFilterProjectCollection.fetchAll({
            filterKey: "project",
            filterValue: this.project.id
        });

        let filters = (await promiseFilters).array;
        let filtersProject = (await promiseFiltersProjects).array;

        filters.forEach(filter => {
            filter.imageFilterProject = filtersProject.find(fp => fp.imageFilter == filter.id);
            filter.selected = filter.imageFilterProject != null;
        });

        this.imageFilters = filters;
        this.loading = false;
    }
};
</script>

<style scoped>
.project-image-filters-wrapper {
    min-height: 200px;
}
</style>

<style>
.project-image-filters-wrapper .search-field {
    max-width: 300px;
}

.project-image-filters-wrapper .table {
    margin-top: 20px;
}

.project-image-filters-wrapper .table .button {
    padding: 0px 40px;
}
</style>