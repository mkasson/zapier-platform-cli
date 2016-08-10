const _ = require('lodash');

const utils = require('../utils');

const makeAccess = (command, recordType) => {
  const recordTypePlural = `${recordType}s`;

  const access = (email) => {
    if (email) {
      return utils.checkCredentials()
        .then(utils.getLinkedApp)
        .then((app) => {
          var url = `/apps/${app.id}/${recordTypePlural}/${email}`;
          if (global.argOpts.delete) {
            console.log(`Preparing to remove ${recordType} ${email} to your app "${app.title}".\n`);
            utils.printStarting(`Removing ${email}`);
            return utils.callAPI(url, {method: 'DELETE'});
          } else {
            console.log(`Preparing to add ${recordType} ${email} to your app "${app.title}".\n`);
            utils.printStarting(`Adding ${email}`);
            return utils.callAPI(url, {method: 'POST'});
          }
        })
        .then(() => {
          utils.printDone();
          console.log(`\n${_.capitalize(recordTypePlural)} updated! Try viewing them with \`zapier ${command}\`.`);
        });
    } else {
      return utils.listEndoint(recordTypePlural)
        .then((data) => {
          console.log(`The ${recordTypePlural} on your app "${data.app.title}" listed below.\n`);
          const ifEmpty = `${_.capitalize(recordTypePlural)} not found. Try adding one with \`zapier ${command} john@example.com\`.`;
          utils.printData(data[recordTypePlural], [
            ['Email', 'email'],
            ['Role', 'role'],
            ['Status', 'status'],
          ], ifEmpty);
        });
    }
  };

  return access;
};

module.exports = makeAccess;
