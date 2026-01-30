const util = require("../../util");

module.exports = {
  params: ({ args }) => {
    const cases = util.getAllCaseByName(args.name);

    return {
      ...args,
      ...cases,
    };
  },
};
