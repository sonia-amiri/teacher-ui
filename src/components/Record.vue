<template>
  <div>
    <el-table :data="records">
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-table-column prop="examPlanId" label="考试计划id" width="80"></el-table-column>
      <el-table-column prop="studentId" label="学生id"></el-table-column>
      <el-table-column prop="studentName" label="学生名字" width="150"></el-table-column>
      <el-table-column prop="title" label="试卷标题"></el-table-column>
      <el-table-column prop="updatedTime" label="交卷时间" :formatter="dateTimeFormatter" width="150"></el-table-column>
      <el-table-column prop="factScore" label="得分" width="60"></el-table-column>
      <el-table-column prop="releaseStatusId" label="作答状态" :formatter="statusFormatter" width="150"></el-table-column>
      <el-table-column align="right" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.releaseStatusId!==4"
            size="mini"
            type="primary"
            @click="openJudjeDialog(scope.row)">进入判题
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="判卷" :visible.sync="dialogOpen" width="60%">
      <el-card class="box-card" style="margin-left: 60px;margin-right: 60px;">
        <div>
          总分:{{ paperPreview.score }}
        </div>
        <div v-for="(question,index) in paperPreview.questions" :key="index">
          <el-divider>{{ index + 1 }}:{{ forTypeName(question.typeId) }}</el-divider>

          <div v-for="(wrapper,index) in question.descriptions" :key="wrapper.id" style="text-align: left">
            <p>{{ index + 1 }}({{question.score}}分): {{ wrapper.description.title }}
              <el-input-number v-model="idToFactScoreDetail[wrapper.id]" :min="0" :max="question.score"
                               :disabled="wrapper.typeId!==5"></el-input-number>
            </p>
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
            <div v-if="wrapper.typeId===3">
              <el-radio-group v-model="idToAnswer[wrapper.id].trueOrFalse" disabled>
                <el-radio :label="true">√</el-radio>
                <el-radio :label="false">×</el-radio>
              </el-radio-group>
            </div>
            <div v-if="wrapper.typeId===5">
              <el-input v-model="idToAnswer[wrapper.id].text" type="textarea" disabled placeholder="答案"></el-input>
            </div>
          </div>

        </div>
        <el-button type="danger" @click="pushCheck">提交</el-button>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import getAllRecords from '@/api/paper/getAllRecords'
import { errorTip, successTip } from '@/utils/tips'
import { dateTimeFormatter } from '@/utils/time'

import { forTypeName } from '@/api/question/createQuestion'
import getPaperByPlanId from '@/api/paper/getPaperById'
import checkPaper from '@/api/paper/checkPaper'

export default {
  name: 'Record',
  created () {
    getAllRecords.request()
      .then(resp => {
        console.log(resp)
        this.records = resp
      }).catch(errorTip)
  },
  data () {
    return {
      count: 0,
      records: [],
      dialogOpen: false,
      dateTimeFormatter: dateTimeFormatter,
      allDone: false,
      paperPreview: {},
      idToAnswer: {},
      examPlanId: 0,
      studentId: 0,
      idToFactScoreDetail: {},
      checkRequest: {},
      statusFormatter (row, col, record, index) {
        const id = record
        // '0-未答卷，1-已开考，开始计时，2-已交卷，等待判卷，4-完成;
        if (id === 0) {
          return '未答卷'
        } else if (id === 1) {
          return '正在作答，计时中'
        } else if (id === 2) {
          return '已交卷，等待判卷'
        } else if (id === 4) {
          return '已判题'
        }
      }
    }
  },
  methods: {
    forTypeName,
    openJudjeDialog (row) {
      console.log(row)
      const factIdToAnswer = row.content
      const factScoreDetail = row.factScoreDetail
      this.checkRequest.studentId = row.studentId
      this.checkRequest.examPlanId = row.examPlanId
      getPaperByPlanId.request(row.paperId)
        .then(resp => {
          this.paperPreview = resp
          this.paperPreview.questions.forEach((question, index) => {
            question.descriptions.forEach(description => {
              this.$set(this.idToAnswer, description.id, factIdToAnswer[description.id])
              this.$set(this.idToFactScoreDetail, description.id, factScoreDetail[description.id] || 0)
            })
          })
          this.dialogOpen = true
        })
    },
    pushCheck () {
      this.checkRequest.idToScore = this.idToFactScoreDetail
      checkPaper.request(this.checkRequest)
        .then(value => {
          successTip('判卷成功')
          this.dialogOpen = false
        })
        .catch(errorTip)
    },
    toOption (id) {
      return String.fromCharCode(id + 65)
    }
  }
}
</script>

<style scoped>

</style>
