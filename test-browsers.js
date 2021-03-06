const playwright = require("playwright");
const { Agent } = require("http");

(async () => {
  for (const browserType of ["chromium"]) {
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext({
      viewport: {
        width: 1536,
        height: 824,
      },
    });
    const page = await context.newPage();

    //Log in user
    await page.goto("https://develop.alison.com");
    await page.$eval(
      "input[name=email]",
      (el) => (el.value = "conormcglockenspiel@gmail.com")
    );
    await page.$eval("input[name=password]", (el) => (el.value = "Galway12"));
    await page.$eval("input[type=submit]", (el) => el.click());
    await delay(4000);

    //clear user tracks
    await page.goto("https://develop.alison.com/admin/users/16849349");
    await page.click("//html/body/div[2]/section[3]/div/div/div/ul/li[2]/a");
    await page.click(
      "//html/body/div[2]/section[3]/div/div/div/div/div[2]/div/div[2]/div/table/tbody/tr/td[8]/a"
    );
    await delay(1000);
    await page.click("//html/body/div[3]/div/div/div[3]/button[2]");
    await delay(2000);

    //start course
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
      //start course button (1)
      await page.click("#bottom_bar_start_topic");
      await delay(5000);

      //await page.click("//html/body/div[5]/div[3]/div/ul[1]/li/a/span[1]");
      await page.click(".player-nav--next-slide");

      //click next slide (2)
      //await page.click("//html/body/div[6]/div[2]/a[4]");
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
      await delay(4000);
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
