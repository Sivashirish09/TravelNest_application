const { runSeleniumTests } = require('../selenium-runner');

runSeleniumTests().catch(err => {
    console.error('Fatal error running Selenium tests:', err);
    process.exit(1);
});
