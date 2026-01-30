const fs = require("fs");

// 파일 분석 함수
const findMethodIndexOfController = (filePath, method) => {
  return new Promise((resolve, reject) => {
    // 파일 읽기
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(`파일을 읽을 수 없습니다: ${err}`);
        return;
      }

      // 줄 단위로 분할
      if (data.includes("\r\n")) {
        data = data.replace(/\r\n/g, "\n");
      }

      const lines = data.split("\n");

      // Controller 여부 확인
      const isController = lines.some((line) => line.includes("@Controller"));

      if (!isController) {
        reject("이 파일은 컨트롤러가 아닙니다.");
        return;
      }
      // 메서드에 해당하는 줄번호 찾기
      const regex = new RegExp(`@${method}\\(`, "i"); // 대소문자 구분 없음

      const lineIndex = lines.findIndex((line) => regex.test(line));

      if (lineIndex === -1) {
        reject(`${method} 메서드가 정의된 엔드포인트가 없습니다.`);
        return;
      }

      // 해당 메서드가 꼭대기가 아닌 경우, 해당 인덱스에서 위로 올라가면서 찾기
      const none = new RegExp(`^$`);

      if (!none.test(lines[lineIndex - 1])) {
        for (let i = lineIndex - 2; i >= 0; i--) {
          if (none.test(lines[i])) {
            resolve(i + 1);
            return;
          }
        }
      }

      resolve(lineIndex);
    });
  });
};

const findLastBracketIndexOfFile = (filePath) => {
  return new Promise((resolve, reject) => {
    // 파일 읽기
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(`파일을 읽을 수 없습니다: ${err}`);
        return;
      }

      // 줄 단위로 분할
      if (data.includes("\r\n")) {
        data = data.replace(/\r\n/g, "\n");
      }

      const lines = data.split("\n");

      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes("}")) {
          resolve(i + 1);
          return;
        }
      }

      reject("파일에 닫는 중괄호가 없습니다.");
    });
  });
};

const findFunctionIndexOfService = (filePath, method) => {
  return new Promise((resolve, reject) => {
    // 파일 읽기
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(`파일을 읽을 수 없습니다: ${err}`);
        return;
      }

      // 줄 단위로 분할
      if (data.includes("\r\n")) {
        data = data.replace(/\r\n/g, "\n");
      }

      const lines = data.split("\n");

      // Service 여부 확인
      const isService = lines.some((line) => line.includes("@Injectable"));

      if (!isService) {
        reject("이 파일은 서비스(Injectable)가 아닙니다.");
        return;
      }

      // 메서드에 해당하는 줄번호 찾기
      const regex = new RegExp(`async ${method}\\(`, "i"); // 대소문자 구분 없음

      const lineIndex = lines.findIndex((line) => regex.test(line));

      if (lineIndex === -1) {
        reject(`${method} 메서드가 정의된 엔드포인트가 없습니다.`);
        return;
      }

      resolve(lineIndex + 1);
    });
  });
};

const findTemplateLineCount = (filePath) => {
  return new Promise((resolve, reject) => {
    // 파일 읽기
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(`파일을 읽을 수 없습니다: ${err}`);
        return;
      }

      // 줄 단위로 분할
      if (data.includes("\r\n")) {
        data = data.replace(/\r\n/g, "\n");
      }

      const lines = data.split("\n");

      const frontmatterEndIndex = lines
        .slice(1)
        .findIndex((line) => line.includes("---"));

      resolve(lines.length - frontmatterEndIndex - 2);
    });
  });
};

module.exports = {
  findMethodIndexOfController,
  findLastBracketIndexOfFile,
  findFunctionIndexOfService,
  findTemplateLineCount,
};
