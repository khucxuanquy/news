<template>
  <div class="box-chat">
    <div class="header">
      <div>
        <img class="avatar" src="https://news.laptrinhmaytinh.com/static/images/logo.png">
          <strong> {{currentUser.fullName}} </strong>
      </div>
      <div>
        <span class="more-info">
          <i class="el-icon-info"></i>
        </span>
      </div>
    </div>
    <div class="chat-view">
      <div class="messages-container">
        <div
          v-for="item in boxMessages"
          :key="item.id"
          :class="item.sender_id == myAccount.id ? 'me' : ''"
          class="chat-item"
        >
          <div class="avatar"><img :src="item.avatar || Logo" /></div>
          <div class="chat-content">
            <p class="text" v-for="m in item.messages" :key="m.id">
              <span>{{ m.content }}</span>
            </p>
          </div>
        </div>
        <span id="ScrollToThis"></span>
      </div>
    </div>
    <div class="input-chat">
      <div class="input-option">
        <button>Ảnh</button>
      </div>
      <!-- <span  id="textarea" contenteditable @input="log(i)">Aa</span> -->
      <div class="input-chat__textarea">
        <textarea
          v-model="content"
          @input="test"
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
  </div>
</template>

<script>
import Logo from "assets/logo.png";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      content: "",
      Logo,
      currentHeight: 0,
      currentReceiveId: null
    };
  },
  created() {
    this.currentReceiveId = this.$route.params.id
    // group messages
    let data = []
    let newData = this.groupMessagesBeforeSaveToStore(data)
    this.CHANGE_MESSAGES(newData);
    this.socket.on('CLIENT_RECEIVE_MESSAGE', data => {
      this.CHAT_NEW_MESSAGE(data)
      this.$nextTick(()=> this.scrollIntoView())
    })
  },
  methods: {
    ...mapActions({
      CHANGE_CONVERSATIONS: "_MESSAGE/CHANGE_CONVERSATIONS",
      CHANGE_MESSAGES: "_MESSAGE/CHANGE_MESSAGES",
      CHAT_NEW_MESSAGE: "_MESSAGE/CHAT_NEW_MESSAGE"
    }),
    submit() {
      if(!this.content) return;
      let data = {
        id: Math.random().toString(36).slice(2),
        sender_id: this.myAccount.id,
        receive_id: this.currentReceiveId,
        content: this.content,
        dateCreated: String(+new Date()),
      }
      // this.CHAT_NEW_MESSAGE(data)
      this.socket.emit('SEND_MESSAGE', data)
      this.$nextTick(()=> this.scrollIntoView())
      setTimeout(() => (this.content = ""), 0);
    },
    test(e) {
      // const { nextElementSibling, style } =  e.target
      // if(this.currentHeight !== nextElementSibling.offsetHeight) console.log(nextElementSibling.offsetHeight);
      // style.height = nextElementSibling.offsetHeight + "px";
    },
    groupMessagesBeforeSaveToStore(data) {
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        newData.push({
          sender_id: data[i].sender_id,
          receive_id: data[i].receive_id,
          avatar: data[i].avatar,
          messages: [
            {
              id: data[i].id,
              content: data[i].content,
              dateCreated: data[i].dateCreated,
            },
          ],
        });
        // Making group messages if 'sender_id' property is same value with next element
        if (data[i + 1] && data[i].sender_id === data[i + 1].sender_id) {
          newData[newData.length - 1].messages.push({
            id: data[i + 1].id,
            content: data[i + 1].content,
          });
          let temp = null;
          for (let j = i + 1; j < data.length - 1; j++) {
            temp = j;
            if (data[j + 1] && data[j].sender_id === data[j + 1].sender_id) {
              newData[newData.length - 1].messages.push({
                id: data[i + 1].id,
                content: data[i + 1].content,
                dateCreated: data[i + 1].dateCreated,
              });
            } else break;
          }
          i = temp;
        }
      }
      return newData;
    },
    scrollIntoView(){
      // let position_messageContainer = document.querySelector(".messages-container").getBoundingClientRect()
      // let lastMessage = document.querySelector(".messages-container>div").lastChild.lastChild
      // if((lastMessage.getBoundingClientRect().bottom - position_messageContainer.height/2) < position_messageContainer.bottom) {
      //   lastMessage.scrollIntoView()
      // }
      
    }
  },
  mounted() {
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
      friends: "_MESSAGE/friends",
    }),
    currentUser(){
      const { friends, currentReceiveId } = this
      return friends.find(user => user.id === currentReceiveId) || {}
    }
  },
  watch: {
    '$route.params': function({ id }) {
      this.currentReceiveId = id
      console.log(id)
      // console.log(this.currentReceiveId)
    },
  },
};
</script>

<style lang="scss">
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
    }

    .more-info {
      font-size: 1.5em;
    }
  }

  .chat-view {
    .messages-container {
      overflow-y: auto;
      height: calc(100vh - 180px);
      background: #cecece;
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
          margin-right: 0.5em;

          img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
          }
        }
        .chat-content {
          width: 100%;

          p.text {
            margin: 0;
            padding: 3px 0px;
            font-size: 1.5em;
            text-align: left;

            span {
              display: inline-block;
              position: relative;
              padding: 6px 8px;
              border-radius: 6px;
              background: #eee;
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