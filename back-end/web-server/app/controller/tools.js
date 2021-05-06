'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
// const path = require('path');


class ToolController extends Controller {


  async uploadShowPic() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const fileInfo = fs.readFileSync(file.filepath);
    const dir = await ctx.service.tools.getUploadFile(file.filename, 'showPic');
    const target = dir.uploadDir;
    try {
      // 处理文件，保存到指定地址
      fs.writeFileSync(target, fileInfo);
      ctx.body = {
        code: 200,
        message: '上传成功',
        url: dir.saveDir,
      };
    } catch (err) {
      ctx.body = {
        code: 500,
        message: err.message,
      };
    } finally {
      // 需要删除临时文件
      await fs.unlink(file.filepath, () => {});
    }
  }

  async delFile(url) {
    const { ctx } = this;
    url = ctx.query.url;
    await this.service.tools.delFile(url);
    ctx.body = {
      code: 200,
      message: '删除成功',
    };
  }
}

module.exports = ToolController;
