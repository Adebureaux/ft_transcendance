<template>
		<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="toolbar">
        <q-btn flat @click="$storeMe.drawerStatus = !$storeMe.drawerStatus" round dense icon="menu" />

        <q-item class="absolute-center relative-position label thetitle glow" clickable @click="goHome" style="">
          <q-tooltip anchor="center middle" self="center middle">Home</q-tooltip>Transcendence
        </q-item>


        <q-space/>

        <q-btn flat @click="notifyCenterLever = !notifyCenterLever" round dense icon="notifications">
          <q-tooltip>Notification center</q-tooltip>
          <div class="notif-count justify-center items-center circle" v-if="nc.notifications.size > 0" />
          <div class="notif-count justify-center items-center" v-if="nc.notifications.size > 0">
            {{ nc.notifications.size < 99 ? nc.notifications.size : '99+' }}
          </div>
          <q-menu anchor="bottom left" class="notifmenu hide-scrollbar">
            <q-item class="n-info">
              <q-item-section class="items-center text-h6">{{ nc.notifications.size }} notification{{ nc.notifications.size > 1 ? 's' :'' }}</q-item-section>
              <q-space/>
              <q-btn icon="cancel" flat @click="nc.clear()" v-if="nc.notifications.size > 0" />
            </q-item>
            <q-list class="n-list">
              <q-item
                v-for="[key, tmp] of nc.notifications" :key="key"
                class="row notif-item q-ma-sm"
                :class="notifcolor(tmp.options)"
              >

                <q-img v-if="tmp.options.avatar" :src="tmp.options.avatar" class="notify-avatar q-mr-sm"/>
                <!-- <q-icon v-if="tmp.options?.type == 'info' "     name="info" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'negative' " name="error" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'positive' " name="done" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'warning' "  name="warning" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'message' "  name="chat" size="32px" class="q-mr-sm"/> -->

                <q-item-section class="notify-message">
                  {{ tmp.options.message }}
                  <q-separator/>
                  {{ getRelativeDate(tmp.createdAt) }}
                </q-item-section>

                <q-space/>

                <q-btn icon="cancel" flat @click="nc.pop(tmp.id)"/>

              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn class="r-mx-md" flat @click="goSettingsNotif" round dense icon="settings"><q-tooltip>Settings</q-tooltip></q-btn>
      </q-toolbar>
    </q-header>


    <q-drawer v-model="$storeMe.drawerStatus" show-if-above :breakpoint="500" :width="300">
      <q-scroll-area class="scroll">
        <ConversationList />
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 90px">
        <q-item clickable @click="goProfilePage" class="usercard">
          <q-tooltip anchor="center middle" self="center middle">
            Your profile page
          </q-tooltip>
            <q-item-section v-if="$storeMe.username">
              <Avatars :username=$storeMe.username :size=60 />
              <!-- <q-img :src="`/api/avatar/${$storeMe.username}/thumbnail`" width="60px" height="60px"
              img-class="usercard-image" /> -->
            </q-item-section>
            <q-item-section class="usercard-name">
              <!-- <q-item-label class="usercard-name-label">{{ $storeMe.username }}</q-item-label> -->
              <q-item-label>{{ $storeMe.username }}</q-item-label>
            </q-item-section>
        </q-item>
      </q-img>
      <q-dialog v-model="settings">
        <settings />
      </q-dialog>
      <q-dialog persistent v-model="invitationFrom">
        <GameInvitation :opponent="opponent" :map=maps :difficulty=difficulty />
      </q-dialog>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ConversationList from 'src/pages/ConversationList/ConversationList.vue'
import Settings from 'src/components/Settings.vue'
import Avatars from 'src/components/Avatars.vue'
import GameInvitation from 'src/components/GameInvitation.vue'
import ncc, { NotifyOptions, NotifyCenter, Notifications } from 'src/services/notifyCenter'
import ld from 'lodash'

export default defineComponent({
  name: 'MainLayout',
  components: {
    ConversationList,
    Settings,
    GameInvitation,
    Avatars
  },
  props: {},
  setup() {
    const invitationFrom = ref(false)
    const settings = ref(false)
    const notifyCenterLever = ref(false)
    return {
      notifyCenterLever,
      settings,
      openSettings() { settings.value = true },
      invitationFrom,
    }
  },
  data() {
    return {
      nc: ncc,
      opponent: "",
      maps: "",
      difficulty: "",
      listening_for_game_invite: false
    }
  },
  methods: {
    notifcolor(options: NotifyOptions) {
      if (options.type)
      {
        switch (options.type) {
          case 'info':     return 'n-info'
          case 'negative': return 'n-negative'
          case 'positive': return 'n-positive'
          case 'warning':  return 'n-warning'
          case 'message':  return 'n-message'
        }
      }
      return 'n-other'
    },
    getRelativeDate(cdate: Date): string {
      function floorStr(n: number) {
        return (n < 10 ? '0' : '') + n
      }

      const now = new Date()

      if (now.getDate() - cdate.getDate() == 0)
        return 'Today at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == 1)
        return 'Yesterday at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == -1)
        return 'Tomorrow at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else
      {
        const d = cdate.getDate()
        const m = (cdate.getMonth() + 1)
        return floorStr(d) + '/'
             + floorStr(m) + '/'
             + cdate.getFullYear() + ' '
             + floorStr(cdate.getHours()) + ':'
             + floorStr(cdate.getMinutes())
      }
    },
    goProfilePage() {
      this.$router.push({
        path: '/profile/me',
      })
    },
    goSettingsNotif() {
      this.openSettings()
    },
    logout() {
      this.$router.push("/logout")
    },
    goHome() {
      this.$router.push("/")
    },
    onGameInviteBusy(data: any, callback: Function) {
      callback('DECLINED')
    },
    onGameInvite(data: any, callback: Function) {
      const that = this
      this.opponent = data.from
      this.maps = data.map
      this.difficulty = data.difficulty
      this.$ws.removeListener('game-invite')

      this.$ws.socket.once('game-invite-canceled', (res: any) => {
        that.invitationFrom = false
        document.removeEventListener('invite-response-accept', accept);
        document.removeEventListener('invite-response-decline', decline);
        that.$ws.listen('game-invite', that.onGameInvite)
      })
      const accept = function (res: any) {
        callback('ACCEPTED')
        that.invitationFrom = false
        that.$ws.socket.once('game-setup-and-init-go-go-power-ranger', (gameOptions: any, callback: Function) => {
          callback("OK")
          if (gameOptions.map == "3D")
            that.$router.push(`/game3d/${gameOptions.gameId}?playerOneName=${gameOptions.playerOneName}&playerTwoName=${gameOptions.playerTwoName}`)
          else
            that.$router.push(`/game/${gameOptions.gameId}?playerOneName=${gameOptions.playerOneName}&playerTwoName=${gameOptions.playerTwoName}`)
          // that.$router.push(`/game/${gameOptions.gameId}`)
          document.removeEventListener('invite-response-accept', accept);
        })
        document.removeEventListener('invite-response-decline', decline);
        that.$ws.removeListener('game-invite-canceled')
        that.$ws.listen('game-invite', that.onGameInvite) //might need to remove this until the game is finished
      }
      const decline = function (res: any) {
        callback('DECLINED')
        that.invitationFrom = false
        document.removeEventListener('invite-response-accept', accept);
        document.removeEventListener('invite-response-decline', decline);
        that.$ws.removeListener('game-invite-canceled')
        that.$ws.listen('game-invite', that.onGameInvite)

      }
      this.invitationFrom = true
      document.addEventListener('invite-response-accept', accept)
      document.addEventListener('invite-response-decline', decline)
    },
    listenForGameInvite() {
      if (!this.listening_for_game_invite) {
        this.$ws.removeListener('game-invite')
        this.$ws.listen('game-invite', this.onGameInvite)
        this.listening_for_game_invite = true;
      }
    },
    stopListeningForGameInvite() {
      if (this.listening_for_game_invite) {
        this.$ws.removeListener('game-invite')
        this.$ws.listen('game-invite', this.onGameInviteBusy)

        this.listening_for_game_invite = false;
      }
    },

    handleUserConnectedEvent(users: Array<string>) {
      const diff = ld.difference(users, this.$storeChat.connectedUsers)
      if (diff.length > 2)
        this.nc.send({
          message: `${users.length} users connected !`,
          color: 'cyan',
        })
      else
        diff.forEach(e => {
          if (e != this.$storeMe.username)
            this.nc.send({
              message: `${e} is connected !`,
              color: 'cyan',
              avatar: `/api/avatar/${e}/thumbnail`,
            })
        });

      if (diff.includes(this.$storeMe.username))
        this.nc.send({
          message: `Welcome back ${this.$storeMe.username} ! Ready to lose ?`,
          type: 'positive',
          avatar: `/api/avatar/${this.$storeMe.username}/thumbnail`,
        })
      users.forEach((user) => {
        if (this.$storeChat.connectedUsers.includes(user) == false)
          this.$storeChat.connectedUsers.push(user);
      });

    },
    handleUserDisconnectedEvent(username: string) {
      this.$storeChat.connectedUsers = this.$storeChat.connectedUsers.filter(
        (elem: any) => {
          return elem !== username;
        }
      );
      this.nc.send({
        message: `${username} disconnected !`,
        color: 'cyan',
        avatar: `/api/avatar/${username}/thumbnail`,
      })
    },
    handleNotifMessageEvent(payload: any) {
      interface __NotifMessage {
          username: string;
          message: string;
      }
      const notif : __NotifMessage = payload as __NotifMessage

      this.nc.send({
        message: `New message from ${notif.username}: ${notif.message}`,
        type: 'message',
        avatar: `/api/avatar/${notif.username}/thumbnail`,
      })
    },
    listenForMatchmaking()
		{
		 // console.log("YssssssssssssssssssO")
  	 // if (!this.listening_for_matchmaking)
		 // {
		  this.stopListeningForGameInvite();
		  // this.listening_for_matchmaking = true;
		  // console.log("YOOOOOOOOOO")
		  this.$ws.socket.once('game-setup-and-init-go-go-power-ranger', (gameOptions: any, callback: Function) => {
			  callback("OK")
			  console.log(gameOptions)
			  this.$router.push(`/game${(gameOptions.map == "3D") ? '3d' : ''}/${gameOptions.gameId}?playerOneName=${gameOptions.playerOneName}&playerTwoName=${gameOptions.playerTwoName}`)
			  this.StoplisteningForMatchmaking()
			  this.stopListeningForGameInvite()
		  })
		 // }
		},
		StoplisteningForMatchmaking()
		  {
			  // if (this.listening_for_matchmaking)
			  // {
				  this.listenForGameInvite()
				  this.$ws.socket.removeListener('game-setup-and-init-go-go-power-ranger')
				  // this.listening_for_matchmaking = false;
			  // }
		  }
  },
  async created() {
  this.nc.init(this.$q)
//   this.$api.init(this)
	this.$storeChat.$reset()
	this.$storeMe.$reset()
	this.$storeMe.init(this)
	await this.$storeMe.fetch()
    await this.$ws.connect().then(async () => {

		this.$storeChat.init(this.$ws, this) // set socket in the store
		// clean possibly old datas
		this.$storeChat.leave()

		// connect and init WebSockets

		this.$ws.listen("user-connected", this.handleUserConnectedEvent);
		this.$ws.listen("user-disconnected", this.handleUserDisconnectedEvent);
		this.$ws.listen("notifmessage", this.handleNotifMessageEvent);
    this.listenForGameInvite()
	}).catch((err) => {console.log(err)})
    // fetch datas
  },
  mounted() {
    document.addEventListener('can-listen-for-game-invite', this.listenForGameInvite)
    document.addEventListener('stop-listening-for-game-invite', this.stopListeningForGameInvite)
    document.addEventListener('ready-for-matchmaking',this.listenForMatchmaking);
		document.addEventListener('stop-for-matchmaking',this.StoplisteningForMatchmaking)
  },

  beforeUnMount() {
    this.$ws.removeListener('game-invite')
    document.removeEventListener('can-listen-for-game-invite', this.listenForGameInvite)
    document.removeEventListener('stop-listening-for-game-invite', this.stopListeningForGameInvite)
    document.removeEventListener('ready-for-matchmaking',this.listenForMatchmaking);
		document.removeEventListener('stop-for-matchmaking',this.StoplisteningForMatchmaking)
    this.$ws.disconnect()
  }

});
</script>

<style lang="sass">
.usercard-image
  border-radius: 1000px
  z-index: 2

.notifmenu
  width: 420px !important
  background-color: $bg-primary

body
  background-color: $bg-primary !important
  color: grey
</style>

<style lang="sass" scoped>
@use "../css/interpolate" as r

.toolbar
  height: 90px
  background-color: $bg-secondary !important
  color: grey

.scroll
  height: calc(100% - 90px)
  margin-top: 90px
  background-color: $bg-secondary
  overflow-x: hidden


.usercard
  display: flex
  height: 90px
  width: 300px

.usercard-name
  flex-basis: 100px
  // add '...' to the end of name if it overflow the container
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  font-size: 1.35em
  font-weight: bold
  color: $orange-7

.usercard-name-label
  padding: 5px

.usercard-name-label:hover
  border-radius: 15px
  background-color: $grey-7

.notify-avatar
  border-radius: 100px
  width: 42px
  height: 42px

.notif-item
  color: black

.n-info
  background-color: $grey-7

.n-negative
  background-color: $red

.n-positive
  background-color: $green

.n-warning
  background-color: $yellow

.n-other
  background-color: $grey-7

.n-message
  background-color: $yellow-4

.notif-count
  width: 20px
  height: 20px
  position: absolute
  margin-bottom: 29px
  margin-left: 22px
  font-size: 14px
  font-weight: bold
  color: white

.circle
  background-color: red
  border-radius: 100px
  margin-bottom: 27px

.n-info
  background-color: $bg-primary
  z-index: 1
  position: fixed
  width: 420px

.n-list
  margin-top: 60px
.thetitle
  font-family: 'Press Start 2P'
  font-weight: bold
  @include r.interpolate(font-size, 320px, 2560px, 10px, 40px)

.glow
  text-shadow: 1px 1px 2px white
  color: transparent
  --bg-size: 200%
  background: -webkit-linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)  0 0 / var(--bg-size) 100%
  -webkit-background-clip: text
  background-clip: text
  -webkit-text-fill-color: transparent
  animation: glowing 18s infinite linear


@keyframes glowing
  0%
    background-position: 0 0
  50%
    background-position: 400% 0
  100%
    background-position: 0 0

</style>
