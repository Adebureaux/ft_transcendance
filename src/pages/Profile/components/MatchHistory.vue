<template>
<div class="doc-container">
  <div class="row">
    <q-item class="col" clickable @click=goProfilePage(pOne)>
      <q-tooltip anchor="center middle" self="center right">{{ pOne }}'s profile</q-tooltip>
      <q-item-section avatar>
          <q-avatar class="avatar">
              <q-img :src="avatarOne"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="label username">{{pOne}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator class="mobile-hide" vertical inset color="white"/>
      <q-item class="col-2">
        <q-item-section>
          <q-item-label class="bigger score"><span v-bind:class=status>{{status}}</span></q-item-label>
          <q-item-label class="label score">{{scoreOne}} - {{scoreTwo}}</q-item-label>
        </q-item-section>
      </q-item>
    <q-separator class="mobile-hide" vertical inset color="white"/>
    <q-item class="col" clickable @click=goProfilePage(pTwo)>
      <q-tooltip anchor="center middle" self="center left">{{ pTwo }}'s profile</q-tooltip>
      <q-item-section>
        <q-item-label class="right label username">{{pTwo}}</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar class="avatar">
            <q-img :src="avatarTwo"/>
          </q-avatar>
        </q-item-section>
      </q-item>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MatchHistory',
  props: {
    status : { type: String , default: 'Defeat' },
    pOne : { type: String , default: '' },
    pTwo : { type: String , default: '' },
    scoreOne : { type: Number, default: 0 },
    scoreTwo : { type: Number, default: 0 }
  },
  methods: {
    goProfilePage(username : string) {
      this.$router.push({
        path: '/profile/' + username,
      })
    }
  },
  data () {
    return {
      avatarOne: '/api/avatar/' as string,
      avatarTwo: '/api/avatar/' as string
    }
  },
  created () {
    this.avatarOne += `${this.pOne}/medium`
    this.avatarTwo += `${this.pTwo}/medium`
  },
  updated () {
    this.avatarOne = `/api/avatar/${this.pOne}/medium`
    this.avatarTwo = `/api/avatar/${this.pTwo}/medium`
  }
})
</script>

<style lang="sass" scoped>
@use "../../../css/interpolate" as r

.score
  text-align: center

.Draw
  color: $orange

.Victory
  color: $green

.Defeat
  color: $red

.username
  overflow: auto

.right
  text-align: right

.avatar
  @include r.interpolate(font-size, 320px, 2560px, 35px, 75px)

.q-item
  @include r.interpolate(padding, 320px, 2560px, 2px, 15px)

.q-item__section--side
  @include r.interpolate(padding, 320px, 2560px, 2px, 15px)

.q-item__section--avatar
  min-width: 2.5rem

.doc-container
  @include r.interpolate(width, 320px, 2560px, 300px, 1350px)
  @include r.interpolate((margin-top, margin-bottom), 320px, 2560px, 12px, 50px)
  @include r.interpolate((margin-left, margin-right), 320px, 2560px, 6px, 25px)
  height: auto
  background-color: grey
  border-radius: 25px
</style>
