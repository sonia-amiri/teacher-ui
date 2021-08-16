<template>
  <el-select
    :value="value"
    @change="$emit('input', value);$emit('change', value)"
    v-model="value"
    clearable
    filterable
    remote
    placeholder="لطفا موضوعات را وارد کنید"
    :remote-method="search"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { errorTip } from '@/utils/tips'
import getSubject from '@/api/subject/getSubject'
export default {
  name: 'SubjectSelector',
  data () {
    return {
      options: [],
      value: '',
      loading: false,
      keyword: ''
    }
  },
  methods: {
    search (name) {
      const params = getSubject.initParams()
      this.loading = true
      params.name = name.trim()
      params.perPage = 50
      getSubject.request(params)
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
