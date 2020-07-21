const playwright = require("playwright");
const { devices } = require("playwright");
const { Agent } = require("http");

(async () => {
  for (const browserType of ["webkit"]) {
    if (browserType == "chromium") {
      deviceList = [
        "Blackberry PlayBook",
        "BlackBerry Z30",
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

      const browser = await playwright[browserType].launch({ headless: false });
      const context = await browser.newContext({
        ...testDevice,
      });
      const page = await context.newPage();

      await delay(5000);
      await page.goto("https://develop.alison.com");
      await delay(5000);
      await page.$eval(
        "input[name=email]",
        (el) => (el.value = "conormcglockenspiel@gmail.com")
      );
      await page.$eval("input[name=password]", (el) => (el.value = "Galway12"));
      await page.$eval("input[type=submit]", (el) => el.click());

      await delay(5000);

      //clear user tracks
      await page.goto("https://develop.alison.com/admin/users/16849349");
      await page.click("//html/body/div[2]/section[3]/div/div/div/ul/li[2]/a");
      await page.click(
        "//html/body/div[2]/section[3]/div/div/div/div/div[2]/div/div[2]/div/table/tbody/tr/td[8]/a"
      );
      await delay(1000);
      await page.click("//html/body/div[3]/div/div/div[3]/button[2]");
      await delay(2000);

      await page.goto("https://develop.alison.com/resume/courses/1851");

      //go through a module
      let count = 0;
      let progress;
      let spanElement; //element for module progress % number

      console.log("-----------------------------------------------------");
      console.log("Browser Type:" + browserType);
      console.log("Device: " + deviceName);

      //cycle through 7 topics and ensure module progress is updating as necessary
      while (count < 6) {
        //Click start button on a topic
        try {
          await delay(10000);
          const startButton = await page.$("#player_button_right");
          await page.evaluate((el) => el.click(), startButton);

          //Click next Slide on a topic
          const frame = page.frame("iframe");
          await delay(10000);
          const nextButton = await frame.$("//html/body/div/div/button[2]");
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
