<template>
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="app-logo">科学研究实验<br />记录与协作平台</div>
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <el-icon><DataAnalysis /></el-icon>
        <span>项目总览</span>
      </router-link>
      <router-link to="/projects" class="nav-item" active-class="active">
        <el-icon><Folder /></el-icon>
        <span>项目管理</span>
      </router-link>
      <router-link to="/experiments" class="nav-item" active-class="active">
        <el-icon><Document /></el-icon>
        <span>实验记录</span>
      </router-link>
      <router-link to="/reagents" class="nav-item" active-class="active">
        <el-icon><Box /></el-icon>
        <span>试剂管理</span>
      </router-link>
      <router-link to="/reagent-usages" class="nav-item" active-class="active">
        <el-icon><Tickets /></el-icon>
        <span>领用记录</span>
      </router-link>
    </aside>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background: #f5f7fa;
  color: #303133;
}
.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  min-height: 100vh;
}
.app-sidebar {
  background: #001529;
  color: #fff;
  padding: 24px 0;
  position: sticky;
  top: 0;
  height: 100vh;
}
.app-logo {
  font-size: 18px;
  font-weight: 600;
  padding: 0 24px 24px;
  border-bottom: 1px solid #1f3a57;
  margin-bottom: 12px;
  line-height: 1.4;
}
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  cursor: pointer;
  color: #c9d6e4;
  font-size: 14px;
  transition: all 0.2s;
  text-decoration: none;
}
.nav-item:hover { background: #1f3a57; color: #fff; }
.nav-item.active { background: #409eff; color: #fff; }
.nav-item .el-icon { margin-right: 10px; }
.app-main {
  padding: 24px;
  overflow-x: hidden;
}
@media (max-width: 760px) {
  .app-shell { grid-template-columns: 1fr; }
  .app-sidebar { height: auto; position: static; }
}
</style>
