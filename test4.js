const playwright = require("playwright");
const { Agent } = require("http");
let conor;

(async () => {
  for (const browserType of ["chromium", "firefox", "webkit"]) {
    if (browserType != webkit) {
      deviceList = [];
    } else {
      deviceList = [];
    }

    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext({
      viewport: {
        width: 1536,
        height: 824,
      },
    });
    const page = await context.newPage();

    await page.goto("https://stg-test.alison.com/about/deleteTracksForConor");
    await delay(2000);

    await page.goto("https://develop.alison.com");
    await page.$eval(
      "input[name=email]",
      (el) => (el.value = "conormcglockenspiel@gmail.com")
    );
    await page.$eval("input[name=password]", (el) => (el.value = "Galway12"));
    await page.$eval("input[type=submit]", (el) => el.click());

    await delay(4000);

    await page.goto("https://develop.alison.com/resume/courses/1851");

    //go through a module
    let count = 0;
    let progress;
    let spanElement;
    let topicName;
    console.log("-----------------------------------------------------");
    console.log("Browser Type:");
    console.log(browserType);
    console.log("Results:");
    while (count < 5) {
      //await page.click("#reminders_open");

      await delay(10000);
      await page.click("#bottom_bar_start_topic");

      await delay(2000);
      await page.click(".player-nav--next-slide");

      //await page.click("#butNext");
      await delay(2000);
      progress = await page.$(".module-progress");

      spanElement = await progress.getProperty("innerText");
      spanElement = await spanElement.jsonValue();
      //var progressNumber = spanElement.replace(/^\D+/g, "");
      var progressNumber = spanElement.replace(/\D/g, "");
      console.log("Progress is: " + spanElement);
      if (progressNumber <= count) {
        console.log("PROGRESS ISSUE");
      }
      count += 1;

      // await page.click("#butNext");
      await page.click(".next-button");
    }
    console.log("--------------------END OF BROWSERTYPE---------------------");
    await browser.close();
  }
})();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
