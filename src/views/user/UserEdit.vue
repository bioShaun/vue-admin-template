<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="权限">
        <el-select filterable v-model="form.role">
          <el-option
            v-for="role in roles"
            :label="role"
            :value="role"
            :key="role"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
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
    id: {}
  },

  data() {
    return {
      form: {
        name: "",
        password: "",
        phone: "",
        email: ""
      },
      roles: ["admin", "user"]
    };
  },

  methods: {
    async onSubmit() {
      if (this.id) {
        await this.$request.put(`rest/users/${this.id}`, this.form);
      } else {
        await this.$request.post("rest/users", this.form);
      }
      this.$router.push("/user/list");
      this.$message({ message: "保存成功!", type: "success" });
    },
    onCancel() {
      this.$router.push("/user/list");
      this.$message({
        message: "cancel!",
        type: "warning"
      });
    },

    async fetch() {
      const res = await this.$request.get(`rest/users/${this.id}`);
      this.form = res;
    }
  },

  created() {
    console.log(this.id);
    this.id && this.fetch();
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
