import deepClone from 'lodash.clonedeep'
import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'
// import { validateActionLabelData, validateObjectLabelData, validateSkeletonTypeData } from './validation.js'
import { validateActionLabelData, validateObjectLabelData } from './validation.js'

const OBJECT_LABEL_LS_KEY = 'objectLabelData'
const ACTION_LABEL_LS_KEY = 'actionLabelData'
// const SKELETON_LABEL_LS_KEY = 'skeletonTypeData'

export const DEFAULT_CONFIGURATION = {
    objectLabelData: [
        {
          "id": 0,
          "name": "default",
          "color": "#00FF00",
          "code": "A00"
      },
      {
          "id": 1,
          "name": "손 짚고 앉기",
          "color": "#c84f4b",
          "code": "A01"
      },
      {
          "id": 2,
          "name": "손 짚지 않고 앉기",
          "color": "#529ff0",
          "code": "A02"
      },
      {
          "id": 3,
          "name": "앉아서 양반다리 하기",
          "color": "#96c28a",
          "code": "A03"
      },
      {
          "id": 4,
          "name": "다리 꼬기",
          "color": "#7f64d6",
          "code": "A04"
      },
      {
          "id": 5,
          "name": "정면으로 눕기",
          "color": "#de85d1",
          "code": "A05"
      },
      {
          "id": 6,
          "name": "옆으로 눕기",
          "color": "#6363d5",
          "code": "A06"
      },
      {
          "id": 7,
          "name": "엎드리기",
          "color": "#c9708c",
          "code": "A07"
      },
      {
          "id": 8,
          "name": "책상에 걸터앉기",
          "color": "#d1deb5",
          "code": "A08"
      },
      {
          "id": 9,
          "name": "선반에서 물건꺼내기",
          "color": "#c7dac9",
          "code": "A09"
      },
      {
          "id": 10,
          "name": "물건 올려두기",
          "color": "#c090df",
          "code": "A10"
      },
      {
          "id": 11,
          "name": "물건 옮기기",
          "color": "#0dcfe4",
          "code": "A11"
      },
      {
          "id": 12,
          "name": "상판 닦기",
          "color": "#61e5fd",
          "code": "A12"
      },
      {
          "id": 13,
          "name": "턱 괴기",
          "color": "#fca591",
          "code": "A13"
      },
      {
          "id": 14,
          "name": "엎드리기",
          "color": "#007f77",
          "code": "A14"
      },
      {
          "id": 15,
          "name": " 물건 넣고 닫기",
          "color": "#acb380",
          "code": "A15"
      },
      {
          "id": 16,
          "name": "물건 넣기",
          "color": "#32dda9",
          "code": "A16"
      },
      {
          "id": 17,
          "name": "내부 확인하기",
          "color": "#ae1c2a",
          "code": "A17"
      }
      ],
      actionLabelData: [
        {
          "id": 0,
          "name": "default",
          "color": "#0000FF",
          "objects": [
              0
          ]
      },
      {
          "id": 1,
          "name": "앉았다가 일어서기(의자, 소파)",
          "color": "#77CCCC",
          "objects": [
              1,
              2,
              3,
              4
          ]
      },
      {
          "id": 2,
          "name": "누웠다가 일어서기(소파)",
          "color": "#ce285a",
          "objects": [
              5,
              6,
              7
          ]
      },
      {
          "id": 3,
          "name": "서 있는 상태의 동작",
          "color": "#188940",
          "objects": [
              8,
              9,
              10,
              11,
              12
          ]
      },
      {
          "id": 4,
          "name": "앉은 상태의 동작",
          "color": "#19e7b4",
          "objects": [
              13,
              14
          ]
      },
      {
          "id": 5,
          "name": "집어넣기",
          "color": "#895dbd",
          "objects": [
              15
          ]
      },
      {
          "id": 6,
          "name": "걸터앉기",
          "color": "#28bcf7",
          "objects": [
              1,
              2,
              3
          ]
      },
      {
          "id": 7,
          "name": "눕기",
          "color": "#2b39dd",
          "objects": [
              5,
              6,
              7
          ]
      },
      {
          "id": 8,
          "name": "문 열고 닫기",
          "color": "#58d54a",
          "objects": [
              16,
              17
          ]
      }
      ],

      currentThumbnailActionLabelId: null
}

export const useConfigurationStore = defineStore('configuration', () => {
  const defaultConfiguration = deepClone(DEFAULT_CONFIGURATION)
  const state = reactive(DEFAULT_CONFIGURATION)

  const objectLabelData = JSON.parse(localStorage.getItem(OBJECT_LABEL_LS_KEY))
  const actionLabelData = JSON.parse(localStorage.getItem(ACTION_LABEL_LS_KEY))
  // const skeletonTypeData = JSON.parse(
  //   localStorage.getItem(SKELETON_LABEL_LS_KEY))

  if (objectLabelData) state.objectLabelData = objectLabelData
  if (actionLabelData) state.actionLabelData = actionLabelData
  // if (skeletonTypeData) state.skeletonTypeData = skeletonTypeData

  watch(() => state.objectLabelData, (newValue) => {
    localStorage.setItem(OBJECT_LABEL_LS_KEY, JSON.stringify(newValue))
  }, { deep: true })
  watch(() => state.actionLabelData, (newValue) => {
    localStorage.setItem(ACTION_LABEL_LS_KEY, JSON.stringify(newValue))
  }, { deep: true })
  // watch(() => state.skeletonTypeData, (newValue) => {
  //   localStorage.setItem(SKELETON_LABEL_LS_KEY, JSON.stringify(newValue))
  // }, { deep: true })

  const importObjectLabelData = (objectLabelData) => {
    validateObjectLabelData(objectLabelData)
    state.objectLabelData = objectLabelData
  }
  const importActionLabelData = (actionLabelData) => {
    validateActionLabelData(actionLabelData)
    state.actionLabelData = actionLabelData
  }
  // const importSkeletonTypeData = (skeletonTypeData) => {
  //   validateSkeletonTypeData(skeletonTypeData)
  //   state.skeletonTypeData = skeletonTypeData
  // }
  return {
    ...toRefs(state),
    reset: () => {
      Object.keys(state).map(key => state[key] = defaultConfiguration[key])
    },
    exportConfig: () => {
      return {
        objectLabelData: state.objectLabelData,
        actionLabelData: state.actionLabelData,
        // skeletonTypeData: state.skeletonTypeData
      }
    },
    importObjectLabelData,
    importActionLabelData,
    // importSkeletonTypeData,
    importConfig: (data) => {
    //   const { objectLabelData, actionLabelData, skeletonTypeData } = data
      const { objectLabelData, actionLabelData } = data
      importObjectLabelData(objectLabelData)
      importActionLabelData(actionLabelData)
      // importSkeletonTypeData(skeletonTypeData)
    }
  }
})