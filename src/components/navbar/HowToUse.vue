<template>
<div>
  <div class="columns" v-for="(m, rowIdx) in nbRows" :key="`how-to-col-${m}`">
    <div class="column" v-for="n in nbCols" :key="`how-to-step-${(rowIdx*nbCols+n)}`">
      <div class="card">
        <div class="card-image">
          <figure class="image is-16by9 has-background-grey-light">
            <img src="@/assets/how-to/Step1.png" v-if="rowIdx*nbCols+n === 1"/>
            <img src="@/assets/how-to/Step2.png" v-else-if="rowIdx*nbCols+n === 2"/>
            <img src="@/assets/how-to/Step3.png" v-else-if="rowIdx*nbCols+n === 3"/>
            <img src="@/assets/how-to/Step4.png" v-else-if="rowIdx*nbCols+n === 4"/>
            <img src="@/assets/how-to/Step5.png" v-else-if="rowIdx*nbCols+n === 5"/>
<!--            <img src="@/assets/how-to/Step6.png" v-else-if="rowIdx*nbCols+n === 6"/>-->
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <div class="title is-48x48">
                {{(rowIdx*nbCols+n)}}.
              </div>
            </div>
            <div class="media-content">
              <p class="title is-4">{{$t(`how-to-step${(rowIdx*nbCols+n)}`)}}</p>
            </div>
          </div>

          <div class="content has-text-grey" v-if="currentUser.guestByNow && lockedStepsForGuest.includes(n)">
            <i class="fas fa-lock fa-fw"></i> {{$t('locked-for-guest')}}}
          </div>
          <div class="content" v-else>
            <i18n :path="`how-to-content${(rowIdx*nbCols+n)}`">
              <i class="fas fa-fw fa-list-alt" place="project"></i>
              <i class="far fa-fw fa-images" place="images"></i>
              <i class="fas fa-fw fa-tasks" place="analyses"></i>
              <i class="fas fa-fw fa-copy" place="layers"></i>
            </i18n>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {get} from '@/utils/store-helpers';

export default {
  name: 'how-to-use',
  data() {
    return {
      nbSteps: 6,
      nbCols: 3,
      lockedStepsForGuest: [3, 4],
      icons: {
        'projects': '',
        'images': '',
        'analyses': ''
      }
    };
  },
  computed: {
    currentUser: get('currentUser/user'),
    nbRows() {
      return Math.round(this.nbSteps/this.nbCols);
    }
  },
  methods: {
  }
};
</script>

<style>


</style>
