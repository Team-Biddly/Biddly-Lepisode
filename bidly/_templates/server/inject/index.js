const CaseUtil = require("../../util");
const FindIndexUtil = require("../../findIndex");

module.exports = {
  prompt: async ({ prompter, args }) => {
    const { logic } = await prompter.prompt({
      type: "select",
      name: "logic",
      message: "어떤 종류의 로직을 삽입하시겠습니까?",
      choices: ["Reorder"],
    });

    if (logic === "Reorder") {
      const { name } = await prompter.prompt({
        type: "input",
        name: "name",
        message: "Reorder 로직을 삽입할 모듈 이름(영문)을 입력해주세요.",
      });

      const { domain } = await prompter.prompt({
        type: "input",
        name: "domain",
        message: "Reorder 로직을 삽입할 모듈 이름(한글)을 입력해주세요.",
      });

      const cases = CaseUtil.getAllCaseByName(name);

      const methodLineNumber = await FindIndexUtil.findMethodIndexOfController(
        `apps/server/src/app/${cases.kebab}/${cases.kebab}.controller.ts`,
        "Patch"
      );

      const lastLine = await FindIndexUtil.findLastBracketIndexOfFile(
        `apps/server/src/app/${cases.kebab}/${cases.kebab}.service.ts`
      );

      const createLine = await FindIndexUtil.findFunctionIndexOfService(
        `apps/server/src/app/${cases.kebab}/${cases.kebab}.service.ts`,
        "create"
      );

      const updateLine = await FindIndexUtil.findFunctionIndexOfService(
        `apps/server/src/app/${cases.kebab}/${cases.kebab}.service.ts`,
        "update"
      );

      const deleteLine = await FindIndexUtil.findFunctionIndexOfService(
        `apps/server/src/app/${cases.kebab}/${cases.kebab}.service.ts`,
        "delete"
      );

      const createTemplateLineCount = await FindIndexUtil.findTemplateLineCount(
        `${__dirname}/reorder/06_inject-create.ts.ejs.t`
      );

      const updateTemplateLineCount = await FindIndexUtil.findTemplateLineCount(
        `${__dirname}/reorder/07_inject-update.ts.ejs.t`
      );

      const deleteTemplateLineCount = await FindIndexUtil.findTemplateLineCount(
        `${__dirname}/reorder/08_inject-delete.ts.ejs.t`
      );

      return {
        ...args,
        ...cases,
        methodLineNumber,
        lastLine,
        createLine,
        updateLine: updateLine + createTemplateLineCount,
        deleteLine:
          deleteLine + createTemplateLineCount + updateTemplateLineCount,
        logic,
        domain,
      };
    }
  },
};
