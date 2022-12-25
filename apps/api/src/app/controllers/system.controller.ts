import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

const { execSync } = require('child_process');
const fs = require('fs');
const moment = require("moment-timezone");
const path = require('path');

@Controller()
export class SystemController {
	constructor(
	) { }

	@Get('systemInfo')
	async getSystemInfo(
		@Res() res: Response,
	) {
		try {
			console.log('get systemInfo() start');

			// get client build dt.
			let clientBuildDt = this.getFileUpdateDt(path.join(__dirname, '../web/index.html'));

			// get server build dt.
			let serverBuildDt = this.getFileUpdateDt(path.join(__dirname, './main.js'));

			// get git log.
			let gitLog = this.getGitLog();

			console.log('get systemInfo() end');
			res.json({
				clientBuildDt: clientBuildDt,
				serverBuildDt: serverBuildDt,
				gitLog: gitLog?.toString(),
			});
		} catch (e) {
			console.log(e.stack);
			res.json({ message: e.message });
		}
	}

  // get file update dt.
  getFileUpdateDt(path: string) {
		try {
			const file = fs.statSync(path);
			const fileDt = moment(file.mtime).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm:ss");
			// console.log('file update dt:' + fileDt);
			return fileDt;
		} catch (e) {
			console.log(e.toString());
			return null;
		}
	}

	// get git log.
	getGitLog() {
		try {
			// const gitLog = execSync('git log -5 --no-merges --pretty=format:"[%ad] %h %an : %s" --date=format:"%Y/%m/%d %H:%M:%S"');
			const gitLog = execSync('git log --no-merges --pretty=format:"[%ad] %h %an : %s" --date=format:"%Y/%m/%d %H:%M:%S"');
			// console.log(`git log: ${gitLog.toString()}`)
			return gitLog;
		} catch (e) {
			console.log(e.toString());
			return null;
		}
	}
}



