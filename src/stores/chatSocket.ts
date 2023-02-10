import { defineStore } from 'pinia';
import io from 'socket.io-client';
import {
  User,
  Follows,
  Blocks,
  Message,
  Channel,
  Subscription,
  Game,
  Avatar,
  eSubscriptionState,
  eRole,
  eChannelType,
} from 'src/services/api.models'
import {
  IWSMessages,
  IWSError,
  IWSInfos,
  IUserInfos,
  IJoinChannelPayload,
  Message_Aknowledgement_output,
} from 'src/models/messages.ws';
import ws from 'src/services/ws.service';

let scrollBack = null

export const useChatSocketStore = defineStore('chatSocket', {
  state: () => ({
    vue            : null as any,
    init           : false as boolean,
    socket         : {} as ws,
    currentChannel : '' as string,
    channelType    : '' as '',
    password       : '' as string,
    name           : '' as string,
    text           : '' as string,
    connectedUsers : [] as Array<string>,
    SubscribedUsers: [] as Array<Subscription>,
  }),

  getters: {
    getMessage(state: any) {
      return state.messages
    }
  },

  actions: {
    joinRoom(channelId: string, onFinishCallback: Function) {
      if (this.init == false)
        return

      this.scrollBack = onFinishCallback // oui c'est saaaale, mais ça marche

      if (this.currentChannel !== '')
        this.leaveCurrentRoom()
      this.currentChannel = channelId;
      this.socket.emitcb('join-channel', { channelId: channelId, password: this.password }, (res: IJoinChannelPayload) => {
        this.SubscribedUsers = res.data.SubscribedUsers
        this.channelType = res.data.channel_type
        if (res.data.channel_type == 'ONE_TO_ONE')
          this.name = res.data.name
        else
          this.name = res.data.name
        this.scrollBack(res.data.messages, true)
      }, (err: IWSError) => {
        this.vue.$q.notify({
          type: 'negative',
          message: err.message
        })
        this.vue.$router.go(-1) // reviens sur la page precedente pour degager le user de la conv ou il est ban
      })
    },
    leaveCurrentRoom() {
      if (this.init == false || this.currentChannel === '')
        return

      this.socket.emit('leave-channel', { channelId: this.currentChannel })
      this.currentChannel = '';
      this.messages = []
    },
    sendMessage() {
      if (this.init == false || this.currentChannel === '' || this.text.length == 0)
        return

      let payload = {
        channelId: this.currentChannel,
        timestamp: new Date(),
        content: this.text,
        password: this.password
      }
      this.text = ''
      this.socket.emitcb('message', payload, (res: Message_Aknowledgement_output) => {},
      (err: IWSError) => {
        this.vue.$q.notify({
          type: 'negative',
          message: err.message
        })
      });
    },
    init_socket(socket: ws, vue: any) { // used in MainLayout in created()

      this.socket = socket
      this.init = true
      this.vue = vue

      this.socket.listen('message', ((payload: IWSMessages) => {
        console.log('ws message:', payload)
        if (payload.channel_id == this.currentChannel)
          this.scrollBack([payload])
      }));
      this.socket.listen('error', ((payload: IWSError) => {
        console.log('ws error:', payload)
        this.$q.notify({
          type: 'warning',
          message: payload.message
        })
      }));
      this.socket.listen('infos', ((payload: IWSInfos) => {
        console.log('ws infos:', payload)
        this.$q.notify({
          type: 'info',
          message: payload.status
        })
      }));
    },
  }
});
