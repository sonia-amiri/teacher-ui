<template>
  <el-select
    :value="value"
    @change="$emit('input', value)"
    v-model="value"
    multiple
    :multiple-limit="5"
    automatic-dropdown
    filterable
    remote
    placeholder="لطفاً یک کلمه کلیدی وارد کنید"
    :remote-method="search"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.nickname"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { errorTip } from '@/utils/tips'
// import searchUser from '@/api/user/searchUser'
export default {
  name: 'UserSelector',
  data () {
    return {
      options: [],
      value: '',
      loading: false
    }
  },
  methods: {
    search (name) {
      const params = searchUser.initParams()
      this.loading = true
      params.name = name
      params.roleId = 3
      params.perPage = 20
      searchUser.request(params)
        .then(resp => {
          this.options = resp.results
        })
        .catch(errorTip)
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
