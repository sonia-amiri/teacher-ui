<template>
  <el-container class="home_container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.svg" style="display: inline-block; vertical-align: sub; margin-right: 10px;">
        <span>
           پنل دانشجو
        </span>
      </div>
      <el-button type="info" @click="logout">خروج</el-button>
    </el-header>
    <!--主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside width="200px">
        <div class="personal">
         خوش آمدید دانشجو گرامی
        </div>
        <!--侧边栏菜单区域-->
        <el-menu
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="$route.path"
        >
          <el-menu-item :index="'/home/'+item.path" v-for="item in menulist" :key="item.id">
            <template>
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>

            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!--右侧内容区-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { errorTip } from '@/utils/tips'
import store from '../store'

export default {
  name: 'Home',
  beforeCreate () {
    this.$axios.get('api/v1/auth')
      .then((data) => {
        store.state.userInfo.id = data.id
        store.state.userInfo.username = data.username
        store.state.userInfo.nickname = data.nickname
        store.state.userInfo.roleId = data.roleId
        this.menulist = this.getMenuList(store.state.userInfo.roleId)
      }).catch(reason => {
        errorTip(reason)
        return this.$router.push('/')
      })
  },
  data () {
    return {
      state: store.state,
      menulist: []
    }
  },
  methods: {
    logout () {
      this.$axios.delete('api/v1/auth')
      this.$router.push('/')
    },
    getMenuList (id) {
      switch (id) {
        case 1: return [
          { id: 0, path: 'users', authName: 'User Management' }
        ]
        case 2: return [
          { id: 0, path: 'exam', authName: 'take an exam' },
          { id: 1, path: 'courses', authName: 'course' }
        ]
        case 3: return [
          { id: 1, path: 'courses', authName: 'course' },
          { id: 2, path: 'subjects', authName: 'subjects' },
          { id: 3, path: 'questions', authName: 'questions' },
          { id: 4, path: 'papers', authName: 'papers' },
          { id: 5, path: 'exam', authName: 'exam' },
          { id: 6, path: 'records', authName: 'records' }
        ]
      }
    }
  }
}
</script>

<style type="less" scoped>
.personal {
  height: 180px;
  background-color: #847b7b;
}

.home_container {
  height: 100%;
}

.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1f2329;
  color: #fff;
  font-size: 20px;
  text-align: center;
  line-height: 60px;

  > div {
    display: flex;
    align-items: center;
    background-color: #1f2329;
    color: rgba(255, 255, 255, 0.97);
    font-size: 20px;
    text-align: center;
    line-height: 60px;

    > div {
      display: flex;
      align-items: center;
    }
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
}

  .el-main {
    background-color: #ffffff;
    color: #333;
    text-align: center;
    line-height: 40px;
  }
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 40px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

</style>
