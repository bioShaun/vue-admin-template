<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="项目名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="项目类型">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-select filterable v-model="form.user">
          <el-option
            v-for="user of users"
            :label="user.name"
            :value="user._id"
            :key="user._id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{
          this.id ? "编辑" : "创建"
        }}</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {},
  },

  data() {
    return {
      users: [],
      form: {
        name: "",
        type: "",
        user: "",
      },
    };
  },

  methods: {
    async onSubmit() {
      if (this.id) {
        await this.$request.put(`rest/projects/${this.id}`, this.form);
      } else {
        await this.$request.post("rest/projects", this.form);
      }
      this.$router.push("/project/list");
      this.$message({ message: "保存成功!", type: "success" });
    },
    onCancel() {
      this.$router.push("/project/list");
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },

    async fetch() {
      const res = await this.$request.get(`rest/projects/${this.id}`);
      this.form = res;
    },

    async fetchUsers() {
      const res = await this.$request.get(`rest/users`);
      this.users = res;
    },
  },

  created() {
    this.id && this.fetch();
    this.fetchUsers();
  },
};
</script>
