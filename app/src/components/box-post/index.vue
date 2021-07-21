<template>
  <div class="box-post" v-if="medium">
    <el-row class="post-block" type="flex" justify="space-between" :style="{'height': height + 'px'}">
      <el-col :md="12" style="padding-right: 15px">
        <div class="post-thumb"><router-link :to="{path: '/post/' + data.category.url + '/' + data.url }"> <span :style="background"></span></router-link></div>
      </el-col>
      <el-col :md="12">
        <div class="post-content">
          <h4 class="post-title" ><router-link :to="{path: '/post/' + data.category.url + '/' + data.url }" :title="data.title">{{data.title}}</router-link></h4>
          <div class="post-meta">
            <router-link class="post-category" :to="{path: '/category/' + data.category.url }" :style="{'background' : data.category.color || '#000000' }">{{data.category.name}}</router-link>
            <span class="post-date"> <i class="el-icon-time"></i> {{data.dateCreated}}</span>
          </div>
          <p class="summary">{{data.description}}</p>
        </div>
      </el-col>
    </el-row>
  </div>
  <div v-else-if="large" class="box-post large">
    <div class="post-thumb" :style="{'height': height + 'px'}">
      <router-link :to="{path: '/post/' + data.category.url + '/' + data.url }"> <span :style="background"></span></router-link>
    </div>
    <div class="post-content">
      <h4 class="post-title" ><router-link :to="{path: '/post/' + data.category.url + '/' + data.url }" :title="data.title">{{data.title}}</router-link></h4>
      <div class="post-meta">
        <router-link class="post-category" :to="{path: '/category/' + data.category.url }" :style="{'background' : data.category.color || '#000000' }">{{data.category.name}}</router-link>
        <span class="post-date"> <i class="el-icon-time"></i> {{data.dateCreated}}</span>
      </div>
      <p class="summary">{{data.description}}</p>
    </div>
  </div>
  <div v-else-if="small" class="box-post small">
    <div class="post-block">
      <div class="post-thumb" :style="{'height': height + 'px'}">
        <router-link :to="{path: '/post/' + data.category.url + '/' + data.url }"> <span :style="background"></span></router-link>
      </div>
      <div class="post-content">
        <div class="post-meta">
          <router-link class="post-category" :to="{path: '/category/' + data.category.url }" :style="{'background' : data.category.color || '#000000' }">{{data.category.name}}</router-link>
        </div>
        <h4 class="post-title" ><router-link :to="{path: '/post/' + data.category.url + '/' + data.url }" :title="data.title">{{data.title}}</router-link></h4>
      </div>
    </div>
  </div>
  <div v-else-if="mini" class="box-post mini">
    <el-row class="post-block" type="flex" justify="space-between" :style="{'height': height + 'px'}">
      <el-col :md="12" style="padding-right: 15px">
        <div class="post-thumb">
          <router-link :to="{path: '/post/' + data.category.url + '/' + data.url }"> <span :style="background"></span></router-link>
        </div>
      </el-col>
      <el-col :md="12">
        <div class="post-content">
          <h4 class="post-title"><router-link :to="{path: '/post/' + data.category.url + '/' + data.url }" :title="data.title">{{data.title}}</router-link></h4>
          <div class="post-meta">
            <router-link class="post-category" :to="{path: '/category/' + data.category.url }" :style="{'background' : data.category.color || '#000000' }">{{data.category.name}}</router-link>
            <!-- <span class="post-date"> <i class="el-icon-time"></i> {{data.dateCreated}}</span> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {
        title:'',
        description:'',
        dateCreated:'',
        title:'',
        image: '',
        category: {
          url: '',
          name: '',
          color: ''
        }
      }
    },
    medium: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false

    },
    mini: {
      type: Boolean,
      default: false
    },
    large:{
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: 200
    }
  },
  computed: {
    background (){
      return `background-image: url('${this.data.image}')`
    }
  },
};
</script>
<style lang="scss" scoped>
/* COMPONENTS */
.box-post {
  margin-bottom: 1.5rem;
  position: relative;
  &:hover {
    span {
      background-position: center 45%;
    }
  }
  .post-thumb {
    width: 100%;
    height: 100%;

    span {
      display: block;
      background-size: cover;
      transition: all ease 0.5s;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      box-shadow: #00000029 0px 10px 20px;
    }
  }
  .post-content {
    // a {
    //   color: #333;
    // }
    // a:hover {
    //   color: #fc4a00;
    // }
    .post-category {
      display: inline-block;
      padding: 3px 5px;
      margin: 0 0 5px 0;
      border-radius: 8px;
      color: white;
      &:hover {
        text-shadow: 0px 0px 20px white;
      }
    }

    .post-title {
      font-size: 1.1rem;
      font-weight: 700;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      a {
        color: #333;
        opacity: .9;
        &:hover {
          // color: black;
          color:#fc4a00;
          opacity: 1;
        }
      }
    }
    p.summary {
      margin-top: 1rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
  .post-meta {
    .post-date {
      opacity: 0.6;
      margin-left: 8px;
    }
  }
}
.box-post.large {
  // padding-left: .65rem;
  .post-block {
    div:first-child {
      padding: 0;
    }
  }
  .post-title {
    margin-top: 0.5rem;
    font-size: 1.3rem;
  }
}
.box-post.mini {
  margin-bottom: 1rem;
  padding-left: .5rem;
  .post-title {
    font-size: 13px;
  }
  p.summary {
    display: none;
  }
}

.box-post.small {
  .post-thumb {
    &::after,
    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: transparent;
    }
  }
  .post-thumb:after {
    left: 0;
    top: 0;
    border-radius: 5px;
    background: linear-gradient(to bottom, transparent 50%, #000000cc 100%);
    transition: all 0.4s ease;
  }

  .post-block {
    position: relative;
    &:hover {
      .post-content {
        bottom: 1.5rem;
      }
      .post-thumb::before {
        cursor: pointer;
        background-color: #00000033;
      }
    }

    .post-content {
      position: absolute;
      bottom: 1rem;
      left: 0px;
      width: 100%;
      transition: all ease 0.4s;
      padding-left: 5px;

      .post-title a {
        color: #d8d8d8;
        font-size: 0.9rem;
      }
    }
  }
}
@media only screen and (max-width: 500px){
  .box-post {
    margin-bottom: 2rem;
    .post-content {
      p.summary {
        -webkit-line-clamp: 2!important;
      }
    }
  }
}
</style>
