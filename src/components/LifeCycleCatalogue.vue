<template>
  <div class="container-fluid">

    <molgenis-menu></molgenis-menu>

    <div class="row mt-3">

      <div class="col-xl-4 col-lg-4 col-12 mb-2">
        <Tree :treeData="treeData" :itemClick="treeClick"></Tree>
      </div>

      <div class="col-xl-8 col-lg-8 col-12 mb-2">
        <CoreVariables :variable="selectedFeature"></CoreVariables>
      </div>

    </div>

    <div class="row">

      <div class="col-xl-4 col-lg-4 col-12 mb-2"></div>
      <div class="col-xl-8 col-lg-8 col-12 mb-2">
        <Harmonizations :variable="selectedFeature"></Harmonizations>
      </div>

    </div>

  </div>
</template>
<script>
  import Tree from './Tree'
  import CoreVariables from './core-variables/CoreVariables'
  import Harmonizations from './harmonization/Harmonizations'
  import MolgenisMenu from './MolgenisMenu'
  import { SET_SELECTED_FEATURE } from '../store/mutations'
  import { GET_TREE_DATA, GET_CORE_VARIABLES_FROM_TREE, GET_COHORTS } from '../store/actions'
  import { mapGetters } from 'vuex'

  export default {
    name: 'LifeCycleCatalogue',
    components: {
      Tree,
      CoreVariables,
      Harmonizations,
      MolgenisMenu
    },
    computed: {
      ...mapGetters({
        treeData: 'getTreeData',
        selectedFeature: 'getSelectedFeature'
      })
    },
    methods: {
      treeClick (node) {
        this.$store.commit(SET_SELECTED_FEATURE, node.model.value)
        this.$store.dispatch(GET_CORE_VARIABLES_FROM_TREE, node.model.id)
      }
    },
    mounted () {
      this.$store.dispatch(GET_TREE_DATA)
      this.$store.dispatch(GET_COHORTS)
    }
  }
</script>
