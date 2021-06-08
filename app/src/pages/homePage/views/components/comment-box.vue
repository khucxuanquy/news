<template>
    <div class="commentBox">
        <div class="commentBox__avatar">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSno71i9QJt4M_FoHaYoJ8jdEQJvWdhpIPIjw&usqp=CAU" alt="image" />
        </div>
        <div class="commentBox__content">
            <div class="commentBox__text">
                <strong class="user_name">{{data.fullName}}</strong>
                <span class="comment_text">{{data.content}}
                </span>
            </div>
            <div class="commentBox__reaction">
                <i class="far fa-thumbs-up"></i>
                <i @click="onReply()" class="fas fa-comment-dots"></i>
                <span>5 day ago</span>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    methods:{
         onReply() {
      this.$emit('showInput', this.data)
    }
    },
     props: {
    data: {
      type: Object,
      require: true,
    },
  },
}
</script>

<style scoped>
   .commentBox{
       width: 100%;
       max-width: 100%;
       display: flex;
       padding: 10px;
       box-sizing: border-box;
   }
   .commentBox__avatar img{
       width: 50px;
       height: 50px;
       border-radius: 50%;
       padding: 10px;
   }
   .commentBox__content{
       padding: 10px;
       width: 100%;
   }
   .user_name{
       margin-right: 5px;
   }
   .commentBox__reaction{
       padding: 10px 0;
   }
   .commentBox__reaction>*{
       margin-right: 20px;
   }
</style>