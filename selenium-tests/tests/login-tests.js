const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const ExcelJS = require('exceljs');
const path = require('path');
require('chromedriver');

const TOTAL_TEST_CASES = 300;
const TEST_URL = 'file://' + path.resolve(__dirname, '../dummy-login.html');

async function runTests() {
    let driver = await new Builder().forBrowser('chrome')
        .setChromeOptions(new chrome.Options().addArguments('--headless=new')) // Run headless to make 300 tests fast
        .build();

    let testResults = [];
    let passCount = 0;
    let failCount = 0;
    let startTime = new Date();

    console.log(`Starting ${TOTAL_TEST_CASES} test cases...`);

    try {
        for (let i = 1; i <= TOTAL_TEST_CASES; i++) {
            // Test Case Data
            // We'll make every 10th test case valid, the rest invalid to simulate a mix
            const isValid = (i % 10 === 0);
            const username = isValid ? 'testuser' : `user${i}`;
            const password = isValid ? 'password123' : `pass${i}`;
            const expectedResult = isValid ? 'Login successful!' : 'Invalid credentials';

            let resultStatus = 'Pass';
            let actualMessage = '';
            let errorMsg = '';
            let testStartTime = new Date();

            try {
                await driver.get(TEST_URL);
                
                // Wait for the inputs to be ready
                let userField = await driver.wait(until.elementLocated(By.id('username')), 2000);
                await userField.sendKeys(username);
                
                let passField = await driver.findElement(By.id('password'));
                await passField.sendKeys(password);
                
                let loginBtn = await driver.findElement(By.id('login-button'));
                await loginBtn.click();
                
                // Wait for message to appear
                let msgDiv = await driver.wait(until.elementLocated(By.id('message')), 2000);
                // Wait until text is not empty
                await driver.wait(async () => {
                    let text = await msgDiv.getText();
                    return text.length > 0;
                }, 2000);
                
                actualMessage = await msgDiv.getText();

                if (actualMessage !== expectedResult) {
                    resultStatus = 'Fail';
                    errorMsg = `Expected message '${expectedResult}', but got '${actualMessage}'`;
                }

            } catch (err) {
                resultStatus = 'Fail';
                errorMsg = err.message;
            }

            let testEndTime = new Date();
            let duration = testEndTime - testStartTime;

            if (resultStatus === 'Pass') passCount++;
            else failCount++;

            testResults.push({
                testId: `TC-${i.toString().padStart(3, '0')}`,
                username,
                password,
                expectedResult,
                actualMessage,
                status: resultStatus,
                durationMs: duration,
                errorMsg
            });

            if (i % 50 === 0) {
                console.log(`Completed ${i}/${TOTAL_TEST_CASES} tests...`);
            }
        }
    } finally {
        await driver.quit();
    }

    let endTime = new Date();
    let totalDuration = (endTime - startTime) / 1000;

    console.log(`\nTests completed in ${totalDuration}s.`);
    console.log(`Generating Excel report...`);

    // Generate Excel File
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Selenium Tests';
    workbook.created = new Date();

    // Summary Sheet
    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = [
        { header: 'Metric', key: 'metric', width: 30 },
        { header: 'Value', key: 'value', width: 20 }
    ];
    summarySheet.addRows([
        { metric: 'Total Tests Executed', value: TOTAL_TEST_CASES },
        { metric: 'Passed', value: passCount },
        { metric: 'Failed', value: failCount },
        { metric: 'Total Duration (s)', value: totalDuration },
        { metric: 'Execution Date', value: new Date().toLocaleString() }
    ]);

    // Style Summary Sheet
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getCell('B2').font = { color: { argb: 'FF008000' } }; // Green for passed
    if (failCount > 0) {
        summarySheet.getCell('B3').font = { color: { argb: 'FFFF0000' } }; // Red for failed
    }

    // Details Sheet
    const detailsSheet = workbook.addWorksheet('Test Details');
    detailsSheet.columns = [
        { header: 'Test ID', key: 'testId', width: 10 },
        { header: 'Username', key: 'username', width: 15 },
        { header: 'Password', key: 'password', width: 15 },
        { header: 'Expected Result', key: 'expectedResult', width: 25 },
        { header: 'Actual Result', key: 'actualMessage', width: 25 },
        { header: 'Status', key: 'status', width: 10 },
        { header: 'Duration (ms)', key: 'durationMs', width: 15 },
        { header: 'Error Details', key: 'errorMsg', width: 40 }
    ];

    detailsSheet.addRows(testResults);

    // Style Details Sheet
    detailsSheet.getRow(1).font = { bold: true };
    detailsSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            const statusCell = row.getCell('F'); // Status column
            if (statusCell.value === 'Pass') {
                statusCell.font = { color: { argb: 'FF008000' } };
            } else {
                statusCell.font = { color: { argb: 'FFFF0000' } };
            }
        }
    });

    const reportPath = path.resolve(__dirname, '../test-summary.xlsx');
    await workbook.xlsx.writeFile(reportPath);
    console.log(`Excel report generated at: ${reportPath}`);
}

runTests().catch(err => {
    console.error('Fatal error running tests:', err);
    process.exit(1);
});
