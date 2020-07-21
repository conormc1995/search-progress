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

    //login user
    await page.goto("https://develop.alison.com");
    await page.$eval(
      "input[name=email]",
      (el) => (el.value = "conormcglockenspiel@gmail.com")
    );
    await page.$eval("input[name=password]", (el) => (el.value = "Galway12"));
    await page.$eval("input[type=submit]", (el) => el.click());
    console.log("logged in");
    await delay(2000);

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
    console.log("Browser Type: " + browserType);
    console.log("Results:");
    while (count < 6) {
      try {
        await delay(10000);
        let startButton = await page.$("#player_button_right");
        await page.evaluate((el) => el.click(), startButton);

        //Click next Slide on a topic
        const frame = page.frame("iframe");
        await delay(10000);
        let nextButton = await frame.$("//html/body/div/div/button[2]");
        await delay(5000);
        await frame.evaluate((el) => el.click(), nextButton);

        await delay(2000);

        //Grab module progress score and ensure it is increasing
        progress = await page.$(".module-progress");

        spanElement = await progress.getProperty("innerText");
        spanElement = await spanElement.jsonValue();
        var progressNumber = spanElement.replace(/\D/g, "");
        console.log("Progress is: " + spanElement);
        if (progressNumber <= count) {
          console.log("Module Progress not increasing for Topic" + count);
        }
        count += 1;

        //Navigate to next topic and continue cycle
        await frame.evaluate((el) => el.click(), nextButton);
      } catch (e) {
        console.log(e);
        break;
      }
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
