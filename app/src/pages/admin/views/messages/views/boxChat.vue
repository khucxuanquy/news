<template>
  <div class="box-chat" v-loading.fullscreen.lock="isLoading">
    <div class="header">
      <div style="display: flex; align-items: center">
        <img class="avatar" :class="{ online: currentUser.status === 'online' }" :src="currentUser.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'">
        <div style="padding-left: 10px">
          <strong> {{currentUser.fullName}} </strong>
          
          <Bubble v-show="userEntering.includes(this.currentReceiveId)" />
        </div>
      </div>
      <div>
        <span class="more-info">
          <i class="el-icon-info"></i>
        </span>
      </div>
    </div>
    <div class="chat-view">
      <div class="messages-container">
        <div id="ScrollPositionTop" />
        <div
          v-for="item in boxMessages"
          :key="item.id"
          :class="setClassNameForChatItem(item)"
          class="chat-item"
        >
          <div class="avatar"><img :src="currentUser.avatar || 'https://doan.khucblog.com/static/images/avatar-default.jpg'" /></div>
          <div class="chat-content">
            <p class="text" v-for="m in item.messages" :key="m.id" :data-dateCreated="m.dateCreated">
              <span>{{ m.content }}</span>
            </p>
          </div>
        </div>
        <span id="ScrollToThis" />
      </div>
    </div>
    <div class="input-chat">
      <div class="input-option">
        <button>Ảnh</button>
      </div>
      <!-- <span  id="textarea" contenteditable @input="log(i)">Aa</span> -->
      <div class="input-chat__textarea">
        <textarea
          v-model.trim="content"
          @keypress.enter.exact="submit()"
          @keydown.enter.shift.exact="content += `\n`"
          placeholder="Aa"
        ></textarea>
        <div class="hiddenDiv">{{ content || "default" }}</div>
      </div>
      <!-- <textarea placeholder="Aa"></textarea> -->
      <button class="fastly-chat">
        <i class="el-icon-s-promotion"></i>
      </button>
    </div>
    {{ checkClientReadNotice }}
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Bubble from "./components/bubble"
import CONST from 'const/const.js'
export default {
  components: {
    Bubble,
  },
  data() {
    return {
      content: "",
      currentHeight: 0,
      currentReceiveId: null, // id người nhận tin nhắn
      from: 0,
      limit: 20,
      isLoading: false,
      maxMessages: false, // check xem đã lấy hết message trong DB chưa


      scrollHeight: null,
      scrollTop: null,

      // entering
      isEntering: false,
    };
  },
  created() {
    let { id } = this.$route.params
    this.currentReceiveId = id
    // chú ý đến currentReceiveId: người hiện tại đang nhắn 
    // group messages
    this.socket.on('CLIENT_RECEIVE_NEW_MESSAGE', data => {
      // nếu đang ở cùng cuộc hội thoại => hiển thị tin nhắn mới trong hội thoại
      if(this.currentReceiveId === data.sender_id || this.currentReceiveId === data.receive_id) {
        this.CHAT_NEW_MESSAGE(data)
      }
      this.$nextTick(()=> this.scrollToBottom())
    })
    this.socket.on('SERVER_SEND_MESSAGES', data => {
      if(data.length < this.limit) this.maxMessages = true;
      data = data.reverse()
      // neu from !== 0 tuc la load New Messages
      this[!this.from ? 'CHANGE_MESSAGES' : 'PUSH_MESSAGES_AFTER_GET'](this.groupMessagesBeforeSaveToStore(data))
      if(!this.from) this.$nextTick(() => this.scrollToBottom())
      this.$nextTick(() => this.tickToScroll())
      this.isLoading = false
    })
    this.socket.on('SERVER_SEND_ENTERING', data => this.CHANGE_USER_ENTERING(data))
      
    if(this.conversations.length) {
      let index = this.conversations.findIndex(user => user.id === id)
      if(index > -1) {
        this.isLoading = true
        this.getMessages()
      } else this.$router.push('/admin/messages/' + this.conversations[0].id)
    }
  },
  methods: {
    ...mapActions({
      CHANGE_CONVERSATIONS: "_MESSAGE/CHANGE_CONVERSATIONS",
      CHANGE_MESSAGES: "_MESSAGE/CHANGE_MESSAGES",
      CHAT_NEW_MESSAGE: "_MESSAGE/CHAT_NEW_MESSAGE",
      PUSH_MESSAGES_AFTER_GET: "_MESSAGE/PUSH_MESSAGES_AFTER_GET",
      UPDATE_LAST_MESSAGE_IN_CONVERSATIONS: "_MESSAGE/UPDATE_LAST_MESSAGE_IN_CONVERSATIONS",
      CHANGE_USER_ENTERING: "_MESSAGE/CHANGE_USER_ENTERING",
    }),
    submit() {
      if(!this.content.trim()) return;
      let data = {
        sender_id: this.myAccount.id,
        receive_id: this.currentReceiveId,
        content: this.content,
        dateCreated: String(+new Date()),
      }
      // this.CHAT_NEW_MESSAGE(data)
      this.socket.emit('CLIENT_SEND_NEW_MESSAGE', data)
      setTimeout(() => (this.content = ""), 0);
    },
    groupMessagesBeforeSaveToStore(data) {
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        newData.push({
          sender_id: data[i].sender_id,
          receive_id: data[i].receive_id,
          messages: [
            {
              id: data[i].id,
              content: data[i].content,
              dateCreated: CONST.convertDateTimeline(Number(data[i].dateCreated)),
            },
          ],
        });
        // Making group messages if 'sender_id' property is same value with next element
        if (data[i + 1] && data[i].sender_id === data[i + 1].sender_id) {
          newData[newData.length - 1].messages.push({
            id: data[i + 1].id,
            content: data[i + 1].content,
            dateCreated: CONST.convertDateTimeline(Number(data[i + 1].dateCreated)),
          });
          let temp = i + 1; // fix for loop
          for (let j = i + 1; j < data.length; j++) {
            temp = j;
            if (data[j + 1] && data[j].sender_id === data[j + 1].sender_id) {
              newData[newData.length - 1].messages.push({
                id: data[j + 1].id,
                content: data[j + 1].content,
                dateCreated: CONST.convertDateTimeline(Number(data[j + 1].dateCreated)),
              });
            } else break;
          }
          i = temp;
        }
      }
      // if(newData.length) newData[newData.length - 1].tick = true;
      return newData;
    },
    scrollToBottom(){
      // let position_messageContainer = document.querySelector(".messages-container").getBoundingClientRect()
      document.querySelector("#ScrollToThis").scrollIntoView()
      // let lastMessage = document.querySelector(".messages-container>div").lastChild.lastChild
      // if((lastMessage.getBoundingClientRect().bottom - position_messageContainer.height/2) < position_messageContainer.bottom) {
      //   lastMessage.scrollIntoView()
      // }
    },
    getMessages(){
      if(this.maxMessages) return;
      let d = {
        sender_id: this.myAccount.id,
        receive_id: this.currentReceiveId,
        from: this.from * this.limit,
        limit: this.limit
      }
      this.socket.emit('CLIENT_GET_MESSAGES', d)
    },
    LoadNewData(){
      if(this.maxMessages) return;
      this.from += 1;
      let { scrollHeight, scrollTop } = document.querySelector('.messages-container')
      this.scrollHeight = scrollHeight
      this.scrollTop = scrollTop
      this.getMessages()
    },
    tickToScroll(){
      if(this.from) {
        let container = document.querySelector('.messages-container')
        container.scrollTop = container.scrollHeight - this.scrollHeight + this.scrollTop
        // let tickPoint = document.querySelector('.messages-container>.tick')
        // tickPoint.scrollIntoView({ behavior: 'smooth' })
      }
    },
    setClassNameForChatItem(item){
      let className = '';
      if(!item) return className;
      if(item.sender_id == this.myAccount.id) className += 'me';
      return className;
    }
  },
  mounted() {
    let container = document.querySelector('.messages-container')
    let debounce_timer;
    container.addEventListener('scroll', () => {
      if (debounce_timer) clearTimeout(debounce_timer);
      debounce_timer = setTimeout(() => container.scrollTop < 120 ? this.LoadNewData() : '', 20);
    })
    // let textarea = document.querySelector('.input-chat__textarea>textarea')
    // let height_div = document.querySelector('.hiddenDiv').getBoundingClientRect().height
    // textarea.style.height = height_div + 'px'
    // this.currentHeight = height_div
  },
  computed: {
    ...mapGetters({
      conversations: "_MESSAGE/conversations",
      boxMessages: "_MESSAGE/boxMessages",
      myAccount: "_ACCOUNT/myAccount",
      notification: "_ACCOUNT/notification",
      conversations: "_MESSAGE/conversations",
      userEntering: "_MESSAGE/userEntering",
    }),
    currentUser(){
      const { conversations, currentReceiveId } = this
      return conversations.find(user => user.id === currentReceiveId) || {}
    },
    checkClientReadNotice() {
      if(this.notification[this.currentReceiveId]) {
        this.socket.emit("CLIENT_HAS_READ_THE_NOTICE", {
          myAccountId: this.myAccount.id,
          sender_id: this.currentReceiveId
        })
      }
      return;
    }
  },
  watch: {
    '$route.params': function({ id }) {
      if(this.content) this.socket.emit('CLIENT_SEND_ENTERING', { receive_id: this.currentReceiveId, sender_id: this.myAccount.id, isEntering: false });
      this.currentReceiveId = id
      this.isLoading = true
      // reset
      this.maxMessages = false
      this.from = 0;
      this.getMessages()
      this.content = ''
    },
    'content': function (text) {
      // nếu đang nhắn tin
      if(text) {
        if(this.isEntering) return;
        this.isEntering = true;
        this.socket.emit('CLIENT_SEND_ENTERING', { receive_id: this.currentReceiveId, sender_id: this.myAccount.id, isEntering: true });
        return;
      }
      this.socket.emit('CLIENT_SEND_ENTERING', { receive_id: this.currentReceiveId, sender_id: this.myAccount.id, isEntering: false });
      this.isEntering = false
    },
  },
  beforeDestroy() {
    console.log('beforeDestroy')
    this.socket.removeListener("SERVER_SEND_MESSAGES")
    this.socket.removeListener("CLIENT_RECEIVE_NEW_MESSAGE")
  }
};
</script>

<style lang="scss">
@mixin text-gradient {
  color: transparent;
  background-image: linear-gradient(45deg, #2ed8b6, #59e0c5);
  -webkit-background-clip: text;
}
.box-chat {
  width: 100%;
  height: 100%;

  &>.header {
    width: 100%;
    height: 60px;
    padding: .5em;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img.avatar {
      width: 50px;
      border-radius: 50%;
      height: 50px;
      object-fit: contain;
      border: thin solid;
      padding: 5px;
      &.online {
        border: thin solid green;
        box-shadow: 0 4px 18px -4px #42d340a6;
      }
    }

    .more-info {
      font-size: 1.5em;
    }
  }

  .chat-view {
    .messages-container {
      overflow-y: auto;
      height: calc(100vh - 180px);
      background: #eee;
      padding-bottom: 10px;

      &::-webkit-scrollbar {
        background: transparent;
        width: 8px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ced0d4;
        border-radius: 6px;
        cursor: pointer;
      }

      .chat-item {
        display: flex;
        justify-content: flex-start;

        .avatar {
          align-self: flex-end;
          margin:0 0.5em 7px 0;

          img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
          }
        }
        .chat-content {
          width: 100%;
          & > p:last-child {
            &:before, &:after {
              opacity: .5!important;
            }
          }
          p.text {
            margin: 0;
            padding: 3px 0px;
            font-size: 1.5em;
            text-align: left;

            span {
              display: inline-block;
              position: relative;
              word-break: break-word;
              max-width: 50%;
              padding: 6px 8px;
              border-radius: 6px;
              transform: rotate(0deg);
              background: whitesmoke;
              box-shadow: #0000001a 0px 0px 20px;
              transition: all .3s cubic-bezier(0.075, 0.82, 0.165, 1);
            }
            &:after {
              content: attr(data-dateCreated);
              font-size: 16px;
              opacity: 0;
              padding-left: .5em;
            }
            &:hover {
              &:after {
                opacity: .5;
              }
              span {
                color: black;
              }
            }
          }
        }
        &.me {
          justify-content: flex-end;

          .avatar {
            display: none;
          }

          p.text {
            text-align: right;
            padding-right: 1em;

            &:after {
              display: none;
            }

            &:before {
              content: attr(data-dateCreated);
              font-size: 16px;
              opacity: 0;
              padding-right: .5em;
            }
            &:hover:before {
              opacity: .5;
            }
           
           
          }
        }
      }
    }
  }

  .input-chat {
    display: flex;
    align-items: center;
    height: 60px;

    .input-option {
      display: flex;
      width: 60px;
      height: 100%;

      button {
        padding: 0.5em 1em;
        border-radius: 6px;
        background: #5353534d;
        border: none;
        outline: none;
        &:hover {
          opacity: 0.85;
        }
      }
    }
    // textarea
    .input-chat__textarea {
      width: calc(100% - 60px);
      max-height: 60px;
      position: relative;
      overflow-y: hidden;

      textarea {
        width: 100%;
        color: #444;
        overflow-y: auto;
        font-size: 1.2em;
        line-height: 1.3;
        height: 60px;
        resize: none;
        outline: none;
        border: none;
        box-shadow: inset 0 2px 10px #eee;
        padding: .5em 0 0 .5em;

        &::-webkit-scrollbar {
          background: transparent;
          width: 8px;
          cursor: pointer;
        }
        &::-webkit-scrollbar-thumb {
          background: #989ba0;
          border-radius: 6px;
          cursor: pointer;
        }
      }
      .hiddenDiv {
        word-break: break-word;
        visibility: hidden;
        position: absolute;
        z-index: -9999;
        bottom: -100vh;
        width: 100%;
      }
    }

    button.fastly-chat {
      display: none;
      border-radius: 50%;
      background: #5353534d;
      border: none;
      width: 30px;
      height: 30px;
      color: blue;
      transform: scale(1.5);
    }
  }
}
</style>