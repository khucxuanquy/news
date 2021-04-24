<template>
  <div class="conversations">
    <BoxConversation
      :DATA="user"
      v-for="user in users"
      :key="user.id"
      @click.native="activeBoxMessage(user.id)"
    />
  </div>
</template>

<script>
import BoxConversation from "components/box-conversation";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      // boxConv: {
      //   id: 'ahihi',
      //   avatar: "https://scontent.fhan2-3.fna.fbcdn.net/v/t1.6435-1/p100x100/167531732_2895779994030892_5127774523971040107_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=7206a8&_nc_ohc=8wfCFkQqkAcAX-VS3gN&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fhan2-3.fna&tp=6&oh=520413b9bfe33de8317360c827ca9458&oe=60A2A9AA",
      //   fullName: "Khúc Xuân Quý",
      //   status: "online",
      //   text: "hello world, this is a new message this is a new message",
      //   time: "1h",
      // },
    };
  },
  created() {
    this.socket.on("LIST_USERS_ONLINE", (data) => {
      this.CHANGE_USERS_ONLINE(data);
    });
  },
  components: {
    BoxConversation,
  },
  methods: {
    ...mapActions({
      CHANGE_USERS_ONLINE: "_USERS/CHANGE_USERS_ONLINE",
    }),
    activeBoxMessage(id) {
      if (!id || this.$route.params.id == id) return;
      this.$router.push(`${id}`);
    },
  },
  computed: {
    ...mapGetters({
      users: "_USERS/users",
    }),
  },
};
</script>

<style lang="scss">
$width_conversations: 400px;

.conversations {
  width: $width_conversations;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    background: transparent;
    width: 8px;
    cursor: pointer;
  }
  &::-webkit-scrollbar-thumb {
    background: #ced0d4;
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>