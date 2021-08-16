<template>
  <el-radio-group :value="value" v-model="type" @change="$emit('input', type);$emit('change', value)">
    <slot></slot>
    <el-radio :label="1">تک انتخاب</el-radio>
    <el-radio :label="2">چند گزینه ای</el-radio>
    <el-radio :label="3">قضاوت کردن</el-radio>
    <el-radio :label="5">جواب کوتاه</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  name: 'QuestionTypeSelector',
  props: ['value'],
  data () {
    return {
      type: 1
    }
  }
}
</script>

<style scoped>

</style>
