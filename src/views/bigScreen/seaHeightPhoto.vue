<template>
  <v-container fluid style="padding-left:200px">
    <v-carousel
      :cycle="cycle"
      interval="1000"
      hide-delimiters
      show-arrows-on-hover
      progress
      progress-color="#d29c19"
      height="1000"
    >
      <v-btn color="primary" @click="cycle = !cycle">{{ cycle ? $vuetify.lang.t('$vuetify.showData.photo.pauseBtn') : $vuetify.lang.t('$vuetify.showData.photo.playBtn')}}</v-btn>
      <v-btn color="teal" class="ml-3" :href="reportUrl" target="_blank">{{$vuetify.lang.t('$vuetify.showData.photo.viewReport')}}</v-btn>
      <v-carousel-item
        v-for="(item,i) in images"
        :key="i"
        reverse-transition="fade-transition"
        transition="fade-transition"
        eager
        class="mt-12"
      >
        <v-img :src="item.src" eager>
          <p class="white--text mt-6 ml-11" style="font-size:1.25rem;">{{item.name}}</p>
        </v-img>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
import commonCfg from "../../config/common";

let startYear = 1993,
  endYear = 2022,
  lessMonths = 8;
let vm;
export default {
  data() {
    return {
      cycle: false, // 循环播放 loop
      images: [],
      reportUrl: commonCfg.reportUrl
    };
  },
  created() {
    vm = this;

    // 获取图片路径 get image path
    for (let i = startYear; i <= endYear; i++) {
      let month = i == endYear ? lessMonths : 12;
      for (let j = 1; j <= month; j++) {
        let filenamePrefix = j < 10 ? `${i}0${j}` : `${i}${j}`;
        let fileUrl = `${commonCfg.seaHeightPhoto}${filenamePrefix}.png`;
        this.images.push({
          src: fileUrl,
          name: this.setPhotoName(filenamePrefix),
        });
      }
    }
  },
  methods: {
    // 设置照片名字 set photo name
    setPhotoName(src) {
      let imageName = src;
      let year = imageName.substring(0, 4);
      let char = Number(imageName.charAt(4));
      let month;
      if (char == 0) {
        month = imageName.charAt(5);
      } else {
        month = imageName.substring(4);
      }
      let text = vm.$vuetify.lang.t("$vuetify.showData.photo.seaLevel");
      return `${year}-${month} ${text}`;
    },
  },
};
</script>
<style>
/* 解决图片轮播时白屏闪烁 */
/* Solve the problem of white screen flickering when the picture is rotated */
.v-carousel .v-window-item {
  position: absolute;
  top: 0;
  width: 100%;
}
</style>