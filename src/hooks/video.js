import utils from '~/libs/utils.js'
import { useAnnotationStore } from '~/store/annotation.js'
import { useMainStore } from '~/store/index.js'

export const useVideo = () => {
  const annotationStore = useAnnotationStore()
  const mainStore = useMainStore()
  return {
    handleOpen: () => {
      if (annotationStore.hasVideo) {
        utils.confirm('새로운 비디오 파일을 여시겠습니까? 저장하지 않은 모든 작업데이터가 지워집니다.').onOk(() => {
          annotationStore.reset()
          utils.importVideo().then(({ type, videoSrc, filename }) => {
            mainStore.videoFormat = type
            annotationStore.video.src = videoSrc
            annotationStore.video.filename = filename
            annotationStore.video.code = filename.split('.').slice(0,-1).join('.')
            mainStore.drawer = false
          })
        })
      } else {
        utils.importVideo().then(({ type, videoSrc, filename }) => {
          mainStore.videoFormat = type
          annotationStore.video.src = videoSrc
          annotationStore.video.filename = filename
          annotationStore.video.code = filename.split('.').slice(0,-1).join('.')
          mainStore.drawer = false
        })
      }
    },
    handleClose: () => {
      utils.confirm('작업을 종료하시겠습니까? 저장하지 않은 모든 작업데이터가 지워집니다.').onOk(() => {
        annotationStore.reset()
        mainStore.drawer = false
        mainStore.videoFormat = null
      })
    }
  }
}
