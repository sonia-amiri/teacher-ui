<template>
  <div>
    <el-card class="box-card" v-if="allDone" style="margin-left: 60px;margin-right: 60px;">
      <div>
        总分:{{ paperPreview.score }}
      </div>
      <div v-for="(question,index) in paperPreview.questions" :key="index">
        <el-divider>{{ index + 1 }}:{{ forTypeName(question.typeId) }}</el-divider>

        <div v-for="(wrapper,index) in question.descriptions" :key="wrapper.id" style="text-align: left">
          <p>{{ index + 1 }}({{question.score}}分): {{ wrapper.description.title }}</p>
          <div v-if="wrapper.typeId===1||wrapper.typeId===2">
            <div v-for="(option,index) in wrapper.description.options" :key="option.id" style="margin-left: 20px">
              {{ toOption(index) }}: {{ option.name }}
            </div>
            <el-radio-group v-if="wrapper.typeId===1" v-model="idToAnswer[wrapper.id].optionId">
              <el-radio v-for="(o,index) in wrapper.description.options" :key="o.id" :label="o.id">
                {{ toOption(index) }}
              </el-radio>
            </el-radio-group>
            <el-checkbox-group v-if="wrapper.typeId===2" v-model="idToAnswer[wrapper.id].optionIds">
              <el-checkbox v-for="(o,index) in wrapper.description.options" :key="o.id" :label="o.id">
                {{ toOption(index) }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div  v-if="wrapper.typeId===3">
            <el-radio-group v-model="idToAnswer[wrapper.id].trueOrFalse">
              <el-radio :label="true">√</el-radio>
              <el-radio :label="false">×</el-radio>
            </el-radio-group>
          </div>
          <div  v-if="wrapper.typeId===5">
            <el-input v-model="idToAnswer[wrapper.id].text" type="textarea" placeholder="答案"></el-input>
          </div>
        </div>

      </div>
      <el-button type="danger" @click="pushAnswer">交卷！</el-button>
    </el-card>
  </div>
</template>

<script>
// import { forTypeName } from '@/api/question/createQuestion'

// import getPaperByPlanId from '@/api/paper/getPaperByPlanId'
// import pushPaper from '@/api/paper/pushPaper'
import { errorTip, successTip } from '@/utils/tips'
export default {
  name: 'Examining',
  props: ['id'],
  created () {
    this.content.idToAnswer = this.idToAnswer
    getPaperByPlanId.request(this.id)
      .then(resp => {
        this.paperPreview = resp
        this.paperPreview.questions.forEach((question, index) => {
          question.descriptions.forEach(description => {
            this.$set(this.idToAnswer, description.id, {
              optionId: 0,
              optionIds: [],
              text: '',
              trueOrFalse: null
            })
          })
        })
        this.allDone = true
      })
  },
  data () {
    return {
      allDone: false,
      paperPreview: {},
      idToAnswer: {},
      content: {
        examPlanId: parseInt(this.id),
        idToAnswer: this.idToAnswer
      }
    }
  },
  methods: {
    forTypeName,
    toOption (id) {
      return String.fromCharCode(id + 65)
    },
    pushAnswer () {
      console.log(this.content)
      pushPaper.request(this.content)
        .then(value => {
          successTip('交卷成功！')
          this.$router.push('/home/exam')
        })
        .catch(errorTip)
    }
  }
}
</script>

<style scoped>

</style>
