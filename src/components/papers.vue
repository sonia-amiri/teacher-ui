<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>考试列表</el-breadcrumb-item>
      <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle
                 style="float: right"></el-button>
    </el-breadcrumb>

    <el-table :data="paperList" @row-click="openDetail">
      <el-table-column label="id" prop="id" width="60" />
      <el-table-column label="创建者id" prop="teacherId" width="90" />
      <el-table-column label="创建人" prop="teacherName" width="90" />
      <el-table-column label="科目" prop="subjectName" width="100" />
      <el-table-column label="考试时间(秒)" prop="duration" width="100" />
      <el-table-column label="标题" resizable prop="title" show-overflow-tooltip />
      <el-table-column align="right" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="console.log(scope.row.id)">神秘操作</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="创建试卷" :visible.sync="editDialogOpen" width="30%">

      <el-form ref="form" :model="PaperForm" label-width="80px">
        <el-form-item label="所属科目">
          <subject-selector v-model="PaperForm.subjectId"></subject-selector>
        </el-form-item>
        <el-form-item label="试卷标题">
          <el-input v-model="PaperForm.title"></el-input>
        </el-form-item>
        <el-form-item label="时长(分钟)">
          <el-input-number v-model="PaperForm.duration" :min="1"></el-input-number>
        </el-form-item>
        <div v-for="conf in PaperForm.configs" :key="conf.typeId">
          <p> {{ forTypeName(conf.typeId) }} </p>
          <el-form-item label="分数">
            <el-input-number v-model="conf.score" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="数量">
            <el-input-number v-model="conf.count" :min="0"></el-input-number>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="getPreview">创建</el-button>
          <el-button @click="editDialogOpen = false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog title="预览" :visible.sync="previewOpen" width="80%">
      <el-card class="box-card"  style="margin-left: 60px;margin-right: 60px;">
        <div>
          总分:{{ paperPreview.score }}
        </div>
        <div v-for="(question,index) in paperPreview.questions" :key="index">
          <el-divider>{{ index + 1 }}:{{ forTypeName(question.typeId) }}</el-divider>
          <div v-for="(wrapper,index) in question.descriptions" :key="wrapper.id" style="text-align: left">
            <p>{{ index + 1 }}: {{ wrapper.description.title }}</p>
            <div v-if="wrapper.typeId===1||wrapper.typeId===2">
              <div v-for="option in wrapper.description.options" :key="option.id" style="margin-left: 20px">
                {{ String.fromCharCode(option.id + 65) }}:  {{ option.name }}
              </div>
            </div>
          </div>
        </div>
        <el-button type="primary" @click="createPaper">创建</el-button>
        <el-button @click="editDialogOpen = false">试试手气</el-button>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { forTypeName } from '@/api/question/createQuestion'

import getPaperById from '@/api/paper/getPaperById'
import queryPapers from '@/api/paper/queryPapers'

import SubjectSelector from './SubjectSelector'
import { errorTip, successTip } from '@/utils/tips'

export default {
  name: 'papers',
  components: { SubjectSelector },
  created () {
    const params = queryPapers.initParams()
    queryPapers.request(params)
      .then(resp => {
        this.paperList = resp
      })
  },
  data () {
    return {
      paperList: [],
      pagination: {},
      editDialogOpen: false,
      PaperForm: {
        duration: 60,
        title: '试卷测试',
        configs: [
          {
            count: 0,
            score: 0,
            typeId: 1,
            questionIds: []
          },
          {
            count: 0,
            score: 0,
            typeId: 2,
            questionIds: []
          },
          {
            count: 0,
            score: 0,
            typeId: 3,
            questionIds: []
          },
          {
            count: 0,
            score: 0,
            typeId: 5,
            questionIds: []
          }
        ],
        subjectId: null
      },
      previewOpen: false,
      paperPreview: {
        score: 7,
        questions: [
          {
            typeId: 1,
            score: 4,
            descriptions: [
              {
                id: 44,
                typeId: 1,
                description: {
                  title: '这这这这是一个选择16',
                  options: [
                    { id: 1, name: 'aaa而我认为aa' },
                    { id: 2, name: 'bbbbb' },
                    { id: 3, name: 'ccccc' },
                    { id: 4, name: 'ddddd' }
                  ]
                }
              }
            ]
          },
          {
            typeId: 2,
            score: 2,
            descriptions: [
              {
                id: 25,
                typeId: 2,
                description: {
                  title: '这是一个多选题93349462178',
                  options: [{ id: 1, name: 'aaa2324344aa' }, { id: 2, name: '23434' }, {
                    id: 3,
                    name: 'cc打发打发ccc'
                  }, { id: 4, name: 'ddd都是上方法dd' }]
                }
              }
            ]
          },
          {
            typeId: 3,
            score: 1,
            descriptions: [
              {
                id: 67,
                typeId: 3,
                description: {
                  title: '这是一个判断题93349462178'
                }
              }
            ]
          },
          {
            typeId: 5,
            score: 1,
            descriptions: [
              { id: 70, typeId: 5, description: { title: '这是个简答题2，随便说几句吧' } }
            ]
          }]
      },
      forTypeName
    }
  },
  methods: {
    getPreview () {
      if (!this.PaperForm.subjectId) {
        errorTip(new Error('请填写科目'))
        return
      }
      if (!this.PaperForm.title.trim()) {
        errorTip(new Error('请填写试卷标题'))
        return
      }
      this.$axios.post('api/v1/teacher/papers/preview', this.PaperForm)
        .then(data => {
          console.log(data)
          successTip('创建成功')
          this.paperPreview = data
          this.editDialogOpen = false
          this.previewOpen = true
        })
        .catch(errorTip)
    },
    createPaper () {
      console.log(this.paperPreview.questions)
      for (const i in this.paperPreview.questions) {
        const bigQues = this.paperPreview.questions[i]
        console.log(bigQues)
        const typeId = bigQues.typeId
        const ids = bigQues.descriptions.map(value => value.id)
        for (const j in this.PaperForm.configs) {
          const conf = this.PaperForm.configs[j]
          if (conf.typeId === typeId) {
            conf.questionIds = ids
          }
        }
      }
      this.$axios.post('api/v1/teacher/papers', this.PaperForm)
        .then(data => {
          console.log(data)
          successTip('创建成功')
        })
        .catch(errorTip)
    },
    openDetail (row, column, event) {
      console.log('开! ' + row.id)
      getPaperById.request(row.id)
        .then(resp => {
          this.paperPreview = resp
        })
    }
  }
}
</script>

<style scoped>

</style>
