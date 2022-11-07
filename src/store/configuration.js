import deepClone from 'lodash.clonedeep'
import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'
// import { validateActionLabelData, validateObjectLabelData, validateSkeletonTypeData } from './validation.js'
import { validateActionLabelData, validateObjectLabelData } from './validation.js'

const OBJECT_LABEL_LS_KEY = 'objectLabelData'
const ACTION_LABEL_LS_KEY = 'actionLabelData'
// const SKELETON_LABEL_LS_KEY = 'skeletonTypeData'

export const DEFAULT_CONFIGURATION = {
    "objectLabelData": [
        {
            "id": 0,
            "name": "default",
            "color": "#cccccc",
            "code": "A00"
        },
        {
            "id": 1,
            "name": "접근",
            "color": "#ff0800",
            "code": "B01"
        },
        {
            "id": 2,
            "name": "후퇴",
            "color": "#4400ff",
            "code": "B02"
        },
        {
            "id": 3,
            "name": "손 짚고 앉기",
            "color": "#c84f4b",
            "code": "A01"
        },
        {
            "id": 4,
            "name": "손 짚지 않고 앉기",
            "color": "#529ff0",
            "code": "A02"
        },
        {
            "id": 5,
            "name": "앉아서 양반다리 하기",
            "color": "#96c28a",
            "code": "A03"
        },
        {
            "id": 6,
            "name": "앉아서 다리 꼬기",
            "color": "#7f64d6",
            "code": "A04"
        },
        {
            "id": 7,
            "name": "정면으로 눕기",
            "color": "#de85d1",
            "code": "A05"
        },
        {
            "id": 8,
            "name": "옆으로 눕기",
            "color": "#6363d5",
            "code": "A06"
        },
        {
            "id": 9,
            "name": "엎드리기",
            "color": "#c9708c",
            "code": "A07"
        },
        {
            "id": 10,
            "name": "올려두기",
            "color": "#d1deb5",
            "code": "A08"
        },
        {
            "id": 11,
            "name": "옮기기",
            "color": "#c7dac9",
            "code": "A09"
        },
        {
            "id": 12,
            "name": "선반에서 물건꺼내기",
            "color": "#c090df",
            "code": "A10"
        },
        {
            "id": 13,
            "name": "걸터앉기",
            "color": "#0dcfe4",
            "code": "A11"
        },
        {
            "id": 14,
            "name": "상판 닦기",
            "color": "#61e5fd",
            "code": "A12"
        },
        {
            "id": 15,
            "name": "앉아서 턱 괴기",
            "color": "#fca591",
            "code": "A13"
        },
        {
            "id": 16,
            "name": "앉아서 엎드리기",
            "color": "#007f77",
            "code": "A14"
        },
        {
            "id": 17,
            "name": "수납장에서 물건꺼내기",
            "color": "#acb380",
            "code": "A15"
        },
        {
            "id": 18,
            "name": "수납장 문열고 물건 넣고 닫기",
            "color": "#32dda9",
            "code": "A16"
        },
        {
            "id": 19,
            "name": "옷걸이에 객체 걸고 닫기",
            "color": "#ae1c2a",
            "code": "A17"
        },
        {
            "id": 20,
            "name": "양문 열고 옷걸이에 객체 걸고 닫기",
            "color": "#33ff99",
            "code": "A18"
        },
        {
            "id": 21,
            "name": "문열고 책 꽂은 뒤 닫기",
            "color": "#f5f500",
            "code": "A19"
        },
        {
            "id": 22,
            "name": "문열고 물건 넣고 닫기",
            "color": "#9933ff",
            "code": "A20"
        },
        {
            "id": 23,
            "name": "물건 넣기",
            "color": "#ff99ff",
            "code": "A21"
        },
        {
            "id": 24,
            "name": "내부 확인하기",
            "color": "#ffcc99",
            "code": "A22"
        },
        {
            "id": 25,
            "name": "김치냉장고 문 열고 물건 넣기",
            "color": "#00f5f5",
            "code": "A23"
        },
        {
            "id": 26,
            "name": "김치냉장고 문 열고 내부 확인하기",
            "color": "#5c5c00",
            "code": "A24"
        },
        {
            "id": 27,
            "name": "홈바에 물건 넣기",
            "color": "#006cd6",
            "code": "A25"
        },
        {
            "id": 28,
            "name": "홈바 내부 확인하기",
            "color": "#ffff33",
            "code": "A26"
        },
        {
            "id": 29,
            "name": "빨래감 넣기",
            "color": "#ff8000",
            "code": "A27"
        },
        {
            "id": 30,
            "name": "빨래 꺼내기",
            "color": "#f50000",
            "code": "A28"
        },
        {
            "id": 31,
            "name": "드럼 세탁기 빨래감 넣기",
            "color": "#ff00ff",
            "code": "A29"
        },
        {
            "id": 32,
            "name": "드럼 세탁기 빨래 꺼내기",
            "color": "#7b00f5",
            "code": "A30"
        },
        {
            "id": 33,
            "name": "세제 넣고 작동하기",
            "color": "#0000a3",
            "code": "A31"
        },
        {
            "id": 34,
            "name": "음식 넣기",
            "color": "#3399ff",
            "code": "A32"
        },
        {
            "id": 35,
            "name": "전자레인지 내부 확인하기",
            "color": "#00d6d6",
            "code": "A33"
        },
        {
            "id": 36,
            "name": "버튼 누르기",
            "color": "#33ff99",
            "code": "A34"
        },
        {
            "id": 37,
            "name": "커피머신 물 채우기",
            "color": "#00d600",
            "code": "A35"
        },
        {
            "id": 38,
            "name": "원두 채우기",
            "color": "#ffff99",
            "code": "A36"
        },
        {
            "id": 39,
            "name": "주전자 물 채우기",
            "color": "#a35200",
            "code": "A37"
        },
        {
            "id": 40,
            "name": "커피머신 작동하기",
            "color": "#a30000",
            "code": "A38"
        },
        {
            "id": 41,
            "name": "주전자 물 따르기",
            "color": "#005c5c",
            "code": "A39"
        },
        {
            "id": 42,
            "name": "서서 청소하기",
            "color": "#ffccff",
            "code": "A40"
        },
        {
            "id": 43,
            "name": "허리숙여 청소하기",
            "color": "#2e005c",
            "code": "A41"
        },
        {
            "id": 44,
            "name": "버튼 조작하기",
            "color": "#0080ff",
            "code": "A42"
        },
        {
            "id": 45,
            "name": "전화 받고 끊기",
            "color": "#66ffb3",
            "code": "A43"
        },
        {
            "id": 46,
            "name": "오는 전화 바로 끊기(수화기 들었다 놓기)",
            "color": "#66ff66",
            "code": "A44"
        },
        {
            "id": 47,
            "name": "키보드 조작",
            "color": "#d66c00",
            "code": "A45"
        },
        {
            "id": 48,
            "name": "(상부 열고) 키보드 조작",
            "color": "#ff6666",
            "code": "A46"
        },
        {
            "id": 49,
            "name": "마우스 조작",
            "color": "#ad1ec9",
            "code": "A47"
        },
        {
            "id": 50,
            "name": "(상부 열고) 마우스 조작",
            "color": "#607d74",
            "code": "A48"
        },
        {
            "id": 51,
            "name": "전원 버튼 조작",
            "color": "#1715ad",
            "code": "A49"
        },
        {
            "id": 52,
            "name": "(상부 열고) 전원 버튼 조작",
            "color": "#20d444",
            "code": "A50"
        },
        {
            "id": 53,
            "name": "USB 꽂기",
            "color": "#95c720",
            "code": "A51"
        },
        {
            "id": 54,
            "name": "(상부 열고) USB 꽂기",
            "color": "#cca518",
            "code": "A52"
        },
        {
            "id": 55,
            "name": "모니터 조작",
            "color": "#7d6b4d",
            "code": "A53"
        },
        {
            "id": 56,
            "name": "(상부 열고) 터치패드 조작",
            "color": "#935496",
            "code": "A54"
        },
        {
            "id": 57,
            "name": "평판 스캔하기",
            "color": "#912666",
            "code": "A55"
        },
        {
            "id": 58,
            "name": "피더 복사하기",
            "color": "#4a8255",
            "code": "A56"
        },
        {
            "id": 59,
            "name": "용지 리필하기",
            "color": "#36660e",
            "code": "A57"
        },
        {
            "id": 60,
            "name": "토너 리필하기",
            "color": "#733b9c",
            "code": "A58"
        },
        {
            "id": 61,
            "name": "용지 넣기",
            "color": "#664fb0",
            "code": "A59"
        },
        {
            "id": 62,
            "name": "코팅하기",
            "color": "#00607a",
            "code": "A60"
        },
        {
            "id": 63,
            "name": "지폐 계수하기",
            "color": "#7d0505",
            "code": "A61"
        },
        {
            "id": 64,
            "name": "금고열고 물건 넣기",
            "color": "#7d1f72",
            "code": "A62"
        },
        {
            "id": 65,
            "name": "금고 열고 물건 빼기",
            "color": "#6ba145",
            "code": "A63"
        },
        {
            "id": 66,
            "name": "카트 밀고 앞으로 가기",
            "color": "#00c928",
            "code": "A64"
        },
        {
            "id": 67,
            "name": "카트 당겨서 뒤로 가기",
            "color": "#2254c9",
            "code": "A65"
        },
        {
            "id": 68,
            "name": "짐 내리기",
            "color": "#469c35",
            "code": "A66"
        },
        {
            "id": 69,
            "name": "짐 싣기",
            "color": "#cccf1f",
            "code": "A67"
        }
    ],
    "actionLabelData": [
        {
            "id": 0,
            "name": "default",
            "color": "#cccccc",
            "objects": [
                0
            ]
        },
        {
            "id": 1,
            "name": "접근",
            "color": "#c90000",
            "objects": [
                1
            ]
        },
        {
            "id": 2,
            "name": "후퇴",
            "color": "#0000cc",
            "objects": [
                2
            ]
        },
        {
            "id": 3,
            "name": "앉았다가 일어서기",
            "color": "#77CCCC",
            "objects": [
                3,
                4
            ]
        },
        {
            "id": 4,
            "name": "다리 꼬기",
            "color": "#ce285a",
            "objects": [
                5,
                6
            ]
        },
        {
            "id": 5,
            "name": "누웠다가 일어서기",
            "color": "#188940",
            "objects": [
                7,
                8,
                9
            ]
        },
        {
            "id": 6,
            "name": "물건 사용하기",
            "color": "#19e7b4",
            "objects": [
                10,
                11
            ]
        },
        {
            "id": 7,
            "name": "선반 사용하기",
            "color": "#895dbd",
            "objects": [
                12
            ]
        },
        {
            "id": 8,
            "name": "걸터 앉기",
            "color": "#28bcf7",
            "objects": [
                13
            ]
        },
        {
            "id": 9,
            "name": "상판 닦기",
            "color": "#2b39dd",
            "objects": [
                14
            ]
        },
        {
            "id": 10,
            "name": "앉아서 턱 괴기",
            "color": "#58d54a",
            "objects": [
                15
            ]
        },
        {
            "id": 11,
            "name": "앉아서 엎드리기",
            "color": "#8c4c8c",
            "objects": [
                16
            ]
        },
        {
            "id": 12,
            "name": "수납장 사용하기",
            "color": "#490c78",
            "objects": [
                17,
                18
            ]
        },
        {
            "id": 13,
            "name": "집어넣기",
            "color": "#19bf50",
            "objects": [
                19,
                20,
                21,
                22
            ]
        },
        {
            "id": 14,
            "name": "냉장고 문 열고 닫기",
            "color": "#87bd2a",
            "objects": [
                23,
                24
            ]
        },
        {
            "id": 15,
            "name": "김치 냉장고 문 열고 닫기",
            "color": "#b8cf0a",
            "objects": [
                25,
                26
            ]
        },
        {
            "id": 16,
            "name": "이지 홈바 사용하기",
            "color": "#9e1c1c",
            "objects": [
                27,
                28
            ]
        },
        {
            "id": 17,
            "name": "일반 세탁기 문 열고 닫기",
            "color": "#248539",
            "objects": [
                29,
                30
            ]
        },
        {
            "id": 18,
            "name": "드럼 세탁기 문 열고 닫기",
            "color": "#961e6e",
            "objects": [
                0,
                31,
                32
            ]
        },
        {
            "id": 19,
            "name": "세탁기 작동하기",
            "color": "#752dc2",
            "objects": [
                33
            ]
        },
        {
            "id": 20,
            "name": "전자레인지 문 열고 닫기",
            "color": "#137855",
            "objects": [
                34,
                35
            ]
        },
        {
            "id": 21,
            "name": "전자레인지 사용하기",
            "color": "#6c1482",
            "objects": [
                36
            ]
        },
        {
            "id": 22,
            "name": "재료 채우기",
            "color": "#3d8260",
            "objects": [
                37,
                38,
                39
            ]
        },
        {
            "id": 23,
            "name": "커피머신 사용하기",
            "color": "#1b8c37",
            "objects": [
                40
            ]
        },
        {
            "id": 24,
            "name": "주전자 사용하기",
            "color": "#3924ad",
            "objects": [
                41
            ]
        },
        {
            "id": 25,
            "name": "청소기 사용하기",
            "color": "#660ba3",
            "objects": [
                42,
                43
            ]
        },
        {
            "id": 26,
            "name": "전화기 사용하기",
            "color": "#17b08f",
            "objects": [
                44,
                45,
                46
            ]
        },
        {
            "id": 27,
            "name": "키보드 조작",
            "color": "#76b37b",
            "objects": [
                47,
                48
            ]
        },
        {
            "id": 28,
            "name": "마우스 조작",
            "color": "#284ac7",
            "objects": [
                49,
                50
            ]
        },
        {
            "id": 29,
            "name": "전원 버튼 조작 ",
            "color": "#16788a",
            "objects": [
                51,
                52
            ]
        },
        {
            "id": 30,
            "name": "USB 꽂기",
            "color": "#b87f0f",
            "objects": [
                53,
                54
            ]
        },
        {
            "id": 31,
            "name": "모니터 조작",
            "color": "#7a2109",
            "objects": [
                55
            ]
        },
        {
            "id": 32,
            "name": "터치패드 조작",
            "color": "#7700a6",
            "objects": [
                56
            ]
        },
        {
            "id": 33,
            "name": "대형 복합기 사용하기",
            "color": "#cf0250",
            "objects": [
                57,
                58
            ]
        },
        {
            "id": 34,
            "name": "소형 복합기 관리하기",
            "color": "#623091",
            "objects": [
                59,
                60
            ]
        },
        {
            "id": 35,
            "name": "파쇄하기",
            "color": "#24126e",
            "objects": [
                61
            ]
        },
        {
            "id": 36,
            "name": "코팅기 사용하기",
            "color": "#752424",
            "objects": [
                62
            ]
        },
        {
            "id": 37,
            "name": "계수기 사용하기",
            "color": "#8f08a1",
            "objects": [
                63
            ]
        },
        {
            "id": 38,
            "name": "금고 열었다가 닫기",
            "color": "#88c20c",
            "objects": [
                64,
                65
            ]
        },
        {
            "id": 39,
            "name": "카트 이동하기",
            "color": "#fff200",
            "objects": [
                66,
                67
            ]
        },
        {
            "id": 40,
            "name": "카트 사용하기",
            "color": "#ff4f4f",
            "objects": [
                68,
                69
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