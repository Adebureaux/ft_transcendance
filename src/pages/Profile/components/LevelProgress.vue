<template>
<div class="r-py-md">
  <q-item>
    <q-item-label class="absolute-full flex flex-center bigger">Level {{level}}</q-item-label>
  </q-item>
</div>
<q-linear-progress class="progress" :value="progress" color="green">
  <div class="absolute-full flex flex-center">
    <q-badge class="badge" color="white" text-color="black" :label="progressLabel"/>
  </div>
</q-linear-progress>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LevelProgress',
  props: {
      victory     : { type: Number , default: 0  },
      defeat      : { type: Number , default: 0  },
      winReward   : { type: Number , default: 20 },
      loseReward  : { type: Number , default: 10 }
  },
  data () {
    return {
      progress: 0 as number,
      progressLabel: '0.00%' as string,
      level: 0 as number
    }
  },
  created () {
    this.setLevelProgress()
  },
  updated () {
    this.setLevelProgress()
  },
  methods: {
    setLevelProgress() {
      const total = this.victory * this.winReward + this.defeat * this.loseReward
      const progress = ref(total / 100 % 1)

      const level = Math.floor(total / 100)
      if (level > 50) {
        this.level = 50
        this.progress = 1
        this.progressLabel = '100%'
      }
      else {
        this.level = level
        this.progress = progress.value
        this.progressLabel = (progress.value * 100).toFixed(2) + '%'
      }
    }
  }
})
</script>

<style lang="sass" scoped>
@use "../../../css/interpolate" as r

.progress
  @include r.interpolate(font-size, 320px, 2560px, 30px, 50px)

.badge
  @include r.interpolate(font-size, 320px, 2560px, 10px, 30px)
  @include r.interpolate(height, 320px, 2560px, 20px, 40px)
  font-weight: bold
</style>
