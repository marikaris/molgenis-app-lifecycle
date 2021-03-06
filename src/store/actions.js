import api from '@molgenis/molgenis-api-client'
import EntityToTreeMapper from '../util/EntityToTreeMapper'
import {
  SET_TREE_DATA,
  SET_ERROR, SET_CORE_VARIABLE_COLUMNS, SET_CORE_VARIABLE_DATA, SET_COHORT_DATA, SET_HARMONIZATION_DATA,
  SET_RAW_TREE_DATA, SET_SOURCE_VARIABLES, SET_NAVBAR_LOGO
} from './mutations'
import _ from 'lodash'
import EntityToCoreVariableMapper from '../util/EntityToCoreVariableMapper'

/* ACTION CONSTANTS */
export const GET_TREE_DATA = '__GET_TREE_DATA__'
export const GET_CORE_VARIABLES_FROM_TREE = '__GET_CORE_VARIABLES_FROM_TREE__'
export const GET_CORE_VARIABLES = '__GET_CORE_VARIABLES__'
export const GET_COHORTS = '__GET_COHORTS__'
export const GET_HARMONIZATIONS = '__GET_HARMONIZATIONS__'
export const GET_SOURCE_VARIABLES = '__GET_SOURCE_VARIABLES__'
export const GET_NAVBAR_LOGO = '__GET_NAVBAR_LOGO__'

export default {
  [GET_TREE_DATA] ({state, commit}) {
    api.get('/api/v2/UI_Menu').then(response => {
      commit(SET_RAW_TREE_DATA, response.items)
      // We do this because we can test this method more easily
      // We used to use the getters in the generateTreeData method
      const clonedResponse = _.cloneDeep(response)
      const data = EntityToTreeMapper.generateTreeData(clonedResponse.items, state.tree.settings)
      commit(SET_TREE_DATA, data)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_CORE_VARIABLES_FROM_TREE] ({state, commit, dispatch, getters}, treeId) {
    const treeLeaf = getters.getRawTreeData.find((item) => item.key === treeId)
    const variables = treeLeaf.variables.map(variable => variable.variable).join(',')
    dispatch(GET_CORE_VARIABLES, variables)
  },
  [GET_CORE_VARIABLES] ({state, commit, getters}, variables) {
    api.get('/api/v2/LifeCycle_CoreVariables?q=variable=in=(' + variables + ')').then(response => {
      commit(SET_CORE_VARIABLE_COLUMNS, EntityToCoreVariableMapper.generateColumns(response.meta.attributes))
      commit(SET_CORE_VARIABLE_DATA, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_COHORTS] ({state, commit}) {
    api.get('/api/v2/LifeCycle_Cohorts').then(response => {
      commit(SET_COHORT_DATA, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_HARMONIZATIONS] ({state, commit, dispatch}, harmonization) {
    api.get('/api/v2/LifeCycle_Harmonizations/' + harmonization).then(response => {
      commit(SET_HARMONIZATION_DATA, response)
      dispatch(GET_SOURCE_VARIABLES, response.sources)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_SOURCE_VARIABLES] ({state, commit}, sourceVariables) {
    const variables = sourceVariables.map(sourceVariable => sourceVariable.variable).join(',')
    api.get('/api/v2/LifeCycle_SourceVariables?q=variable=in=(' + variables + ')').then(response => {
      commit(SET_SOURCE_VARIABLES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_NAVBAR_LOGO] ({state, commit}) {
    api.get('/api/v2/sys_set_app/app').then(response => {
      commit(SET_NAVBAR_LOGO, response.logo_href_navbar)
    }, error => {
      commit(SET_ERROR, error)
    })
  }
}
