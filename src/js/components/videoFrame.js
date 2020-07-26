const VIDEO_FRAME_TEMPLATE = `
<div>
  <video
    ref="video"
    :src="video.src"
    :width="video.width"
    :height="video.height"
    @loadeddata="handleLoadeddata"
    @seeked="handleSeeked"
    style="display: none"
  ></video>
</div>
`

import utils from '../libs/utils.js'

export default {
  data: () => {
    return {
      backendQueue: [], // index of frame for backend processing
      priorityQueue: [], // index of priority frame that needs to process now
      processedFrameList: [], // index of frames that are already processed
    }
  },
  methods: {
    ...Vuex.mapMutations([
      'cacheFrame',
    ]),
    handleLoadeddata (event) {
      // the trigger
      event.target.currentTime = 0.0
    },
    handleSeeked (event) {
      if (this.video.src) {
        const videoElement = event.target
        const currentTime = videoElement.currentTime
        const currentIndex = utils.time2index(currentTime)
        console.log('currentIndex: ', currentIndex, 'currentTime: ' + currentTime)
        if (this.processedFrameList.indexOf(currentIndex) === -1) {
          // get the image
          const canvas = document.createElement('canvas')
          canvas.width = this.video.width
          canvas.height = this.video.height
          canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height)
          // save to cachedFrames
          this.cacheFrame({
            index: currentIndex,
            frame: canvas.toDataURL('image/jpeg'),
          })
        }
        // trigger next frame
        if (this.priorityQueue.length !== 0) {
          videoElement.currentTime = utils.index2time(this.priorityQueue.shift())
        } else if (this.backendQueue.length !== 0) {
          videoElement.currentTime = utils.index2time(this.backendQueue.shift())
        }
        this.processedFrameList.push(currentIndex)
      }
    },
  },
  watch: {
    leftCurrentFrame: function (newValue) {
      this.priorityQueue.push(newValue)
    },
    rightCurrentFrame: function (newValue) {
      this.priorityQueue.push(newValue)
    },
  },
  computed: {
    video () {
      return this.$store.state.annotation.video
    },
    leftCurrentFrame () {
      return this.$store.state.annotation.leftCurrentFrame
    },
    rightCurrentFrame () {
      return this.$store.state.annotation.rightCurrentFrame
    },
  },
  mounted () {
    this.priorityQueue.push(this.$store.state.annotation.rightCurrentFrame)
    // add frame index into the backendQueue
    // 1. every one second
    for (let i = 1.0; i < this.video.duration; i++) {
      this.backendQueue.push(utils.time2index(i))
    }
    // 2. every 0.1 second
    // for (let i = 0.1; i < this.video.duration; i += 0.1) {
    //   if (i.toFixed(1) % 1 !== 0) {
    //     this.backendQueue.push(utils.time2index(i))
    //   }
    // }
  },
  template: VIDEO_FRAME_TEMPLATE,
}
