import { copyToClipboard, exportFile } from 'quasar'
import { ref } from 'vue'
import utils from '~/libs/utils.js'
import { useAnnotationStore } from '~/store/annotation.js'
// import { useConfigurationStore } from '~/store/configuration.js'
import { useConfigurationStore } from '~/store/configuration.js'
import { useMainStore } from '~/store/index.js'
import deepClone from 'lodash.clonedeep'

export const useAnnotation = () => {
  const configurationStore = useConfigurationStore()
  const annotationStore = useAnnotationStore()
  const mainStore = useMainStore()
  const submitLoading = ref(false)

  const importAdapter = (data) => {
    data.actionAnnotationList.map(label => {
      label.start = label.start_frame / 6;
      label.end = label.end_frame / 6;
      // object <- action_scenario
      if (label.hasOwnProperty('action_scenario')){
        label.object = label.action_scenario;
        delete label.action_scenario;
      }
      delete label.start_frame;
      delete label.end_frame;
    })
    data.video.fps = 10;
    data.video.frames = data.video.frames / 6;
    return data
  }
  const exportAdapter = (data) => {
    data.actionAnnotationList.map(label => {
      label.start_frame = label.start * 6;
      label.end_frame = label.end * 6;
      delete label.start;
      delete label.end;
    })
    delete data.video.src;
    data.video.fps = 60;
    data.video.frames = data.video.frames * 6;
    return data
  }
  const loadAnnotation = (obj) => {
    try {
      // const {
      //   version,
      //   info,
      //   // TODO : project info 추가
      //   annotation,
      //   config
      // } = obj
      // 변수 선언부 개별 분리, 필요한 내용만 로드하도록 수정
      // version -> info.version으로 이동
      // const version = obj.version;
      const info = obj.info;
      const annotation = obj.annotation;
      // config 고정
      // const config = obj.config;
      // version
      if (info.version !== PACKAGE_VERSION) {
        utils.notify('Version mismatch, weird stuff is likely to happen! ' + version + ' != ' + PACKAGE_VERSION,
          'warning')
      }
      // config
      // configurationStore.importConfig(config)
      // annotation
      // adapter 추가
      let adoptAnnotation = deepClone(annotation)
      importAdapter(adoptAnnotation)
      annotationStore.importAnnotation(adoptAnnotation)
      utils.notify('Annotation load successfully!', 'positive')
    } catch (e) {
      utils.notify(e.toString(), 'negative')
      throw e
    }
  }
  const loadAnnotationFromFile = () => {
    utils.importFile().then(file => {
      loadAnnotation(JSON.parse(file))
    })
  }
  return {
    loadAnnotation,
    handleLoad: () => {
      if (annotationStore.hasVideo) {
        utils.confirm(
          '로드하시겠습니까? 현재 라벨링 데이터가 삭제되고 새로운 라벨링 데이터를 불러옵니다.'
        ).onOk(() => {
          loadAnnotationFromFile()
        })
      } else {
        loadAnnotationFromFile()
      }
    },
    handleSave: () => {
      // appearanceid, default, duration 예외처리
      // errorCount 추가
      let errorCount = 0;
      for (let i = 0; i < annotationStore.actionAnnotationList.length; i++){
        if(annotationStore.actionAnnotationList[i].start >= annotationStore.actionAnnotationList[i].end || annotationStore.actionAnnotationList[i].object === 0){
          errorCount++;
        }
      }
      if (errorCount !== 0) {
        utils.confirm(
          '라벨링 내용에 오류가 있습니다. 라벨링 내용을 확인해주세요'
        ).onOk(() => {
        })
      } else {
        utils.prompt(
          'Save',
          '저장될 json파일 이름을 입력해주세요.',
          `${annotationStore.video.filename.split('.').slice(0,-1).join('.')}`).onOk(filename => {
          const data = {
            // version -> info 아래로 이동
            // version: PACKAGE_VERSION,
            // project info 추가
            info: annotationStore.info,
            annotation: annotationStore.exportAnnotation(),
            // config: configurationStore.exportConfig()
          }
          // data exportAdapter 추가 -> 형식에 맞게 export data 변형
          let adoptedExportData = deepClone(data)
          exportAdapter(adoptedExportData.annotation)
          exportFile(
            filename + '.json',
            new Blob([JSON.stringify(adoptedExportData)]),
            { mimeType: 'text/plain' }
          )
          mainStore.drawer = false
        })
      }
    },
    handleSubmit: () => {
      submitLoading.value = true
      const data = {
        // version -> info 아래로 이동
        // version: PACKAGE_VERSION,
        annotation: annotationStore.exportAnnotation(),
        config: configurationStore.exportConfig()
      }
      console.debug('Submitting to: ' + mainStore.submitURL)
      fetch(mainStore.submitURL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => {
        submitLoading.value = false
        if (res.ok) {
          console.debug('Success', res)
          res.json().then(data => {
            const { message, clipboard, type } = data
            if (message) {
              utils.notify('Server: ' + message, type || 'positive')
            }
            if (clipboard) {
              copyToClipboard(clipboard).then(() => {
                utils.notify('Copied to clipboard: ' + clipboard, 'positive', 0, 'center')
              }).catch(() => {
                  utils.notify('Failed to copy to clipboard, please do it manually: ' + clipboard, 'negative', 10000)
                }
              )
            }
          })
        } else {
          utils.notify(`Failed to submit: ${res.statusText} (${res.status})`, 'warning')
        }
      }).catch(err => {
        submitLoading.value = false
        utils.notify('Failed to submit: ' + err, 'negative')
      })
    },
    submitLoading
  }
}
