<template>
<div :class="['description-wrapper', loading ? 'loading' : '']">
  <b-loading :is-full-page="false" :active="loading" class="small" />
  <template v-if="!loading">
    <template v-if="description">
      <div class="ql-snow">
        <div class="ql-editor" v-html="previewDescription"></div> <!-- WARNING can lead to js injection -->
      </div>
      <div class="buttons are-small">
        <button class="button" v-if="croppedDescription" @click="openModal(false)">
          {{ $t('button-full-text') }}
        </button>
        <button class="button" v-if="canEdit" @click="openModal(true)">
          {{ $t('button-edit') }}
        </button>
      </div>
    </template>
    <template v-else>
      <em>{{$t('no-description')}}</em>
      <button v-if="canEdit" class="button is-small margin" @click="openModal(true)">
        {{$t('button-add')}}
      </button>
    </template>
  </template>
</div>
</template>

<script>
import {Description} from 'cytomine-client';
import DescriptionModal from './CytomineDescriptionModal';

import constants from '@/utils/constants.js';

export default {
  name: 'cytomine-description',
  props: {
    object: {type: Object},
    canEdit: {type: Boolean, default: true},
    maxPreviewLength: {type: Number, default: 0} // if set to 0, the description preview is not limited unless stop preview keyword is present
  },
  data() {
    return {
      loading: true,
      description: null,
      modalOpened: false
    };
  },
  watch: {
    async object() {
      await this.fetchDescription();
    },
  },
  computed: {
    previewDescription() {
      let posStop = this.description.data.indexOf(constants.STOP_PREVIEW_KEYWORD);
      if(posStop !== -1) {
        return this.description.data.substring(0, posStop);
      }
      else if(this.maxPreviewLength && this.description.data.length > this.maxPreviewLength) {
        return this.description.data.substring(0, this.maxPreviewLength) + '...';
      }
      else {
        return this.description.data;
      }
    },
    croppedDescription() {
      return this.description.data.length !== this.previewDescription.length;
    }
  },
  methods: {
    openModal(edit) {
      // required to use programmatic modal because the description is sometimes displayed in elements with a
      // CSS transform (e.g. popover) that conflict with the fixed position of the modal
      // (http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/)

      this.$modal.open({
        parent: this,
        component: DescriptionModal,
        props: {
          description: this.description || new Description({data: '', object: this.object}),
          edit
        },
        hasModalCard: true,
        events: {
          change: newDesc => this.description = newDesc
        }
      });
    },
    formatDescription(description) {
      description.data = description.data.replace(new RegExp('"/api/attachedfile/', 'g'), `"${constants.CYTOMINE_CORE_HOST}/api/attachedfile/`);
      return description;
    },
    async fetchDescription() {
      // this.loading = true;
      try {
        this.description = this.formatDescription(await Description.fetch(this.object));
      }
      catch(err) {
        // the error may make sense if the object has no description
        this.description = null;
      }
      this.loading = false;
    }

  },
  async created() {
    await this.fetchDescription();
  }

};
</script>

<style scoped>
.description-wrapper {
  position: relative;
}

.description-wrapper .ql-editor {
  padding: 0;
  white-space: normal;
}

.description-wrapper.loading {
  min-height: 3em;
}

.button.margin {
  margin-left: 0.5em;
}

.ql-snow {
  margin-bottom: 0.5em;
}
</style>
