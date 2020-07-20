const playwright = require("playwright");
const { devices } = require("playwright");
const { Agent } = require("http");

(async () => {
  for (const browserType of ["chromium", "webkit"]) {
    if (browserType == "chromium") {
      deviceList = [
        "Blackberry PlayBook",
        "Blackberry PlayBook landscape",
        "BlackBerry Z30",
        "BlackBerry Z30 landscape",
        "Galaxy Note 3",
        "Galaxy Note 3 landscape",
        "Galaxy Note II",
        "Galaxy Note II landscape",
        "Galaxy S III",
        "Galaxy S III landscape",
        "Galaxy S5",
        "Galaxy S5 landscape",
        "JioPhone 2",
        "JioPhone 2 landscape",
        "Kindle Fire HDX",
        "Kindle Fire HDX landscape",
        "LG Optimus L70",
        "LG Optimus L70 landscape",
        "Microsoft Lumia 550",
        "Microsoft Lumia 550 landscape",
        "Microsoft Lumia 950",
        "Microsoft Lumia 950 landscape",
        "Nexus 10",
        "Nexus 10 landscape",
        "Nexus 4",
        "Nexus 4 landscape",
        "Nexus 5",
        "Nexus 5 landscape",
        "Nexus 5X",
        "Nexus 5X landscape",
        "Nexus 6",
        "Nexus 6 landscape",
        "Nexus 6P",
        "Nexus 6P landscape",
        "Nexus 7",
        "Nexus 7 landscape",
        "Nokia Lumia 520",
        "Nokia Lumia 520 landscape",
        "Nokia N9",
        "Nokia N9 landscape",
        "Pixel 2",
        "Pixel 2 landscape",
        "Pixel 2 XL",
        "Pixel 2 XL landscape",
      ];
    } else {
      deviceList = [
        "iPad (gen 6)",
        "iPad (gen 6) landscape",
        "iPad (gen 7)",
        "iPad (gen 7) landscape",
        "iPad Mini",
        "iPad Mini landscape",
        "iPad Pro 11",
        "iPad Pro 11 landscape",
        "iPhone 6",
        "iPhone 6 landscape",
        "iPhone 6 Plus",
        "iPhone 6 Plus landscape",
        "iPhone 7",
        "iPhone 7 landscape",
        "iPhone 7 Plus",
        "iPhone 7 Plus landscape",
        "iPhone 8",
        "iPhone 8 landscape",
        "iPhone 8 Plus",
        "iPhone 8 Plus landscape",
        "iPhone SE",
        "iPhone SE landscape",
        "iPhone X",
        "iPhone X landscape",
        "iPhone XR",
        "iPhone XR landscape",
        "iPhone 11",
        "iPhone 11 landscape",
        "iPhone 11 Pro",
        "iPhone 11 Pro landscape",
        "iPhone 11 Pro Max",
        "iPhone 11 Pro Max landscape",
      ];
    }
    for (let deviceName of deviceList) {
      const testDevice = devices[deviceName];
      console.log(deviceName);
      const browser = await playwright[browserType].launch({ headless: false });
      const context = await browser.newContext({
        ...testDevice,
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
        ("");
        await page.click("#player_button_right");

        await delay(8000);

        await page.click("#butNext");
        console.log("clicked once");

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
        await page.click("//html/body/div/div/button[2]");
      }
      console.log(
        "--------------------END OF BROWSERTYPE---------------------"
      );
      await browser.close();
    }
  }
})();

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
