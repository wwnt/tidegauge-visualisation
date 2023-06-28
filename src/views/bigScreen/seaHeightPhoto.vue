<template>
    <div id="photo"></div>
</template>
<script>
import 'viewerjs/dist/viewer.css'
import Vue from 'vue'
import VueViewer from 'v-viewer'//图片查看器 picture viewer
import commonCfg from '../../config/common'
Vue.use(VueViewer)
VueViewer.setDefaults({
    interval: 1000,
    //启用模态背景，为背景指定静态，单击时不会关闭模态。
    //Enable the modal backdrop, specify static for the backdrop that will not close the modal on click.
    backdrop: false,
    //隐藏查看器右上角的按钮
    //Hide the button on the top-right of the viewer.
    button: false,
    //隐藏标题
    //Hide title
    title: false,
    //初始覆盖范围
    //Define the initial coverage of the viewing image.
    initialCoverage: 0.8,
})
let viewer = null;
let startYear = 1993, endYear = 2022, lessMonths = 8;
export default{
    data () {
        return {
        }
    },
    mounted() {
        //let fileNames = []
        //找出文件夹下面以png结尾的所有文件名
        //Find all filenames ending with png under the folder
        //const files = require.context('https://test.navi-tech.net/sea_height_photo/', false, /.png$/).keys();
        //for(let file of files) {
        //    file = file.replace('./', '').replace('.png', '');
            //console.log(file)
        //    fileNames.push(Number(file))
        //}
        //console.log(fileNames)
        //文件名升序排序
        //Sort by filename in ascending order
        // var compare = function (x, y) {//比较函数 comparison function
        //   if (x < y) {
        //     return -1;
        //   } else if (x > y) {
        //     return 1;
        //   } else {
        //     return 0;
        //   }
        // }
        //fileNames.sort(compare)
        //let imagesUrl = []
        //for(let file of fileNames) {
        //   imagesUrl.push(`https://test.navi-tech.net/sea_height_photo/${file}.png`)
        //}
        let imagesUrl = []
        for(let i = startYear;i <= endYear; i++) {
          let month = i == endYear ? lessMonths : 12;
          for(let j = 1;j <= month;j++) {
            let filenamePrefix = j < 10 ? `${i}0${j}` : `${i}${j}`
            imagesUrl.push(`${commonCfg.seaHeightPhoto}${filenamePrefix}.png`)
          }
        }
        viewer = this.$viewerApi({images: imagesUrl})
        new Vue().$mount('#photo')
        
    },
    beforeDestroy() {
      viewer.destroy();
    },
}

</script>