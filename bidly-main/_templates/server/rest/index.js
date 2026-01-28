const CaseUtil = require("../../util");

module.exports = {
  prompt: ({ prompter, args }) =>
    prompter
      .prompt({
        type: "input",
        name: "name",
        message: "모듈 이름(영문)을 입력해주세요.",
      })
      .then(({ name }) =>
        prompter
          .prompt({
            type: "input",
            name: "domain",
            message: "모듈 이름(한글)을 입력해주세요.",
          })
          .then(({ domain }) => {
            const cases = CaseUtil.getAllCaseByName(name);

            return {
              ...args,
              ...cases,
              domain,
            };
          })
      ),
};
