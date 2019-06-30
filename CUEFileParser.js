const fs = require('fs');

exports.CUEFileParser = class {
	static parseFile(filePath) {
		const buffer = fs.readFileSync(filePath);
		return this.parseBuffer(buffer);
	}

	static parseBuffer(buffer) {
		const data = {
			tracks: [],
		};
		const lines = buffer.toString('utf8').split('\n').map(line => line.replace('\r', '')).filter(line => line.length > 0);

		for (let i = 0; i <= lines.length -1; i++) {
			const line = lines[i];
			if (line.startsWith('FILE')) {
				const result = /^FILE "(.*?)" ([a-z0-9]*)$/i.exec(line);
				data.fileName = result[1];
				data.fileFormat = result[2];
			} else if (line.startsWith('TRACK')) {
				const track = {};
				const result = /^TRACK ([\d]+) AUDIO$/i.exec(line);
				track.index = Number(result[1]);
				const childLines = [];

				let childLinesIndex = i+1;
				let newLine = lines[childLinesIndex];

				while (newLine.startsWith('  ')) {
					newLine = lines[childLinesIndex];
					childLinesIndex++;
					if (!newLine || !newLine.startsWith('  ')) break;
					childLines.push(newLine.trim());
				}

				for (const childLine of childLines) {
					if (childLine.startsWith('TITLE')) {
						const result = /^TITLE "([a-z0-9\. ]*)"$/i.exec(childLine);
						track.title = result[1];
					} else if (childLine.startsWith('INDEX 01')) {
						const result = /^INDEX 01 ([0-9:]*)$/i.exec(childLine);
						track.timeCode = result[1];
						track.timeInSeconds = this.formatCUETimeAsSecond(result[1]);
					}
				}
				data.tracks[track.index-1] = track;
				i = (childLinesIndex-2);
			} else {
				console.info('Unknown Line', line, i)
			}
		}
		return data;
	}

	static formatCUETimeAsSecond(time) {
		if (!isNaN(time)) return time;
		if (!time) time = '0:0:00';
		const parts = time.split(':');
		let date = new Date(null);
		date.setMinutes(Number(parts[0]));
		date.setSeconds(Number(parts[1]));
		date.setMilliseconds(Number(parts[2])*10);
		return date.getTime()/1000;
	}
};