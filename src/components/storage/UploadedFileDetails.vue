<template>
<div>
  <h2>
    {{$t('file-tree')}}
  </h2>
  <b-message v-if="error" type="is-danger" has-icon icon-size="is-small" size="is-small">
    <h2> {{ $t('error') }} </h2>
    <p> {{ $t('unexpected-error-info-message') }} </p>
  </b-message>
  <sl-vue-tree v-else v-model="nodes" :allowMultiselect="false">
    <template #toggle="{node}">
      <template v-if="!node.isLeaf">
        <i :class="['tree-toggle', 'fas', node.isExpanded ? 'fa-angle-down' : 'fa-angle-right']"></i>
      </template>
    </template>

    <template #title="{node}">
      <p :class="{'target-element': node.data.id === file.id}">{{node.title}}</p>
    </template>

    <template #sidebar="{node}">
      <div class="filesize">
        {{filesize(node.data.size)}}
      </div>
      <div class="status">
        <uploaded-file-status :file="node.data" :iconOnly="true" />
      </div>
      <div class="buttons">
        <a class="button is-small is-link" :href="node.data.downloadURL">
          {{$t('button-download')}}
        </a>
        <button class="button is-small is-danger" @click="confirmDeletion(node.data)">
          {{$t('button-delete')}}
        </button>
      </div>
      <p class="preview">
        <a v-if="node.data.thumbURL" @click="samplePreview = node.data">
          {{$t('sample-preview')}}
        </a>
        <span v-if="node.data.thumbURL && node.data.macroURL">/</span>
        <a v-if="node.data.macroURL" @click="slidePreview = node.data">
          {{$t('slide-preview')}}
        </a>
      </p>
    </template>
  </sl-vue-tree>

  <template v-if="nbUploadedFiles > 10">
    <div class="level">
      <b-select v-model="nbPerPage" size="is-small" class="level-left">
        <option value="10">10 {{$t('per-page')}}</option>
        <option value="25">25 {{$t('per-page')}}</option>
        <option value="50">50 {{$t('per-page')}}</option>
        <option value="100">100 {{$t('per-page')}}</option>
      </b-select>

      <b-pagination
        class="level-right"
        :total="nbUploadedFiles"
        :current.sync="currentPage"
        size="is-small"
        :per-page="nbPerPage"
      />
    </div>
  </template>

  <template v-if="samplePreview">
    <h2>
      {{$t('sample-preview-of', {filename: samplePreview.originalFilename})}}
      <button class="button is-small" @click="samplePreview = null">{{$t('button-hide')}}</button>
    </h2>
    <img :src="samplePreview.thumbURL">
  </template>
  <template v-else-if="slidePreview">
    <h2>
      {{$t('slide-preview-of', {filename: slidePreview.originalFilename})}}
      <button class="button is-small" @click="slidePreview = null">{{$t('button-hide')}}</button>
    </h2>
    <img :src="slidePreview.macroURL">
  </template>
</div>
</template>

<script>
import SlVueTree from 'sl-vue-tree';
import {UploadedFile, UploadedFileCollection} from 'cytomine-client';
import UploadedFileStatus from './UploadedFileStatus';
import filesize from 'filesize';

export default {
  name: 'uploaded-file-details',
  components: {
    SlVueTree,
    UploadedFileStatus
  },
  props: {
    file: Object, // WARNING: the root of the tree must be the file or its direct parent
    revision: Number // change its value to force refresh
  },
  data() {
    return {
      rootId: null,
      uploadedFiles: [],
      nodes: [],
      slidePreview: null,
      samplePreview: null,
      error: false,

      nbUploadedFiles: 0,
      currentPage: 1,
      nbPerPage: 10,
    };
  },
  computed: {
    collection() {
      return new UploadedFileCollection({
        root: this.rootId,
        max: this.nbPerPage
      });
    }
  },
  watch: {
    file() {
      this.findRoot();
      this.makeTree();
    },
    revision() {
      this.findRoot();
      this.makeTree();
    },
    currentPage() {
      this.findRoot();
      this.makeTree();
    },
    collection() {
      this.makeTree();
    },
    slidePreview(val) {
      if(val) {
        this.samplePreview = null; // if slide preview enabled, disable sample preview
      }
    },
    samplePreview(val) {
      if(val) {
        this.slidePreview = null; // if sample preview enabled, disable slide preview
      }
    },
  },
  methods: {
    findRoot() {
      this.rootId = this.file.root || this.file.id;
    },
    async makeTree() {
      try {
        let data = (await this.collection.fetchPage(this.currentPage - 1));
        this.uploadedFiles = data.array;
        this.nbUploadedFiles = data.totalNbItems;
        this.nodes = (await this.createNodes(null));
      }
      catch(error) {
        console.log(error);
        this.error = true;
      }
    },
    async createNodes(idParent) {
      let directChildren = this.uploadedFiles.filter(file => file.parent === idParent);

      if (directChildren.length === 0 && idParent === null) {
        let missingIds = this.uploadedFiles[0].lTree.split('.');
        await Promise.all(missingIds.slice(0, missingIds.length - 1).map(async id => {
          this.uploadedFiles.push((await UploadedFile.fetch(id)));
        }));
        return this.createNodes(null);
      }

      return await Promise.all(directChildren.map(async file => {
        let children = await this.createNodes(file.id);
        return {
          title: file.originalFilename,
          isLeaf: children.length === 0,
          isDraggable: false,
          isExpanded: true,
          data: {downloadURL: file.downloadURL, ...file}, // data converted to object by sl-vue-tree => need to define downloadURL as property
          children
        };
      }));
    },
    filesize(size) {
      return filesize(size, {base: 10});
    },
    confirmDeletion(file) {
      this.$dialog.confirm({
        title: this.$t('confirm-deletion'),
        message: this.$t('confirm-deletion-file'),
        type: 'is-danger',
        confirmText: this.$t('button-confirm'),
        cancelText: this.$t('button-cancel'),
        onConfirm: () => this.deleteFile(file)
      });
    },
    async deleteFile(file) {
      try {
        await UploadedFile.delete(file.id);
        this.$emit('update');
      }
      catch(error) {
        console.log(error);
        let errorValues = error.response.data.errorValues;
        let text;
        if(errorValues && errorValues.projectNames && errorValues.imageNames) {
          text = this.$t('notif-error-delete-used-uploaded-file', {
            projects: errorValues.projectNames.join(', '),
            names: errorValues.imageNames.join(', ')
          });
        }
        else {
          text = this.$t('notif-error-delete-uploaded-file');
        }
        this.$notify({type: 'error', text});
      }
    }
  },
  created() {
    this.findRoot();
    this.makeTree();
  }
};
</script>

<style scoped>
.target-element {
  font-weight: 600;
  min-width: 0; /* to allow correct handling of overflow-wrap */
}

.filesize {
  width: 8em;
  margin-left: 1em;
}

.status {
  width: 5em;
}

.preview {
  width: 20em;
}

.buttons {
  margin-right: 2em;
  margin-bottom: 0 !important;
}

.buttons .button {
  margin-bottom: 0.5em !important;
  margin-top: 0.2em !important;
}

h2:not(:first-child) {
  margin-top: 1em;
  border-bottom: 2px solid #ddd;
}

h2 .button {
  position: relative;
  bottom: 3px;
  margin-left: 0.8em;
  text-transform: none;
}

>>> .sl-vue-tree-sidebar {
  display: flex;
  align-items: top;
  justify-content: flex-end;
}

>>> .sl-vue-tree-gap {
  border: 0 dotted #bbb;
  border-left-width: 1px;
  position: relative;
  right: 0.95em;
  bottom: 1.25em;
}

>>> .sl-vue-tree-toggle {
  background: #fafafa;
  z-index: 1;
}

>>> .sl-vue-tree-gap:nth-last-child(3) {
  border-width: 0 0 1px 1px !important;
}

>>> ul.pagination-list {
  justify-content: flex-end;
}

.level {
  padding-bottom: 0.5rem !important;
}
</style>
