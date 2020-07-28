const playwright = require("playwright");
const { devices } = require("playwright");
const { Agent } = require("http");

/*
Check course progress is increasing for every device and browser

*/
(async () => {
  for (const browserType of ["chromium", "webkit"]) {
    if (browserType == "chromium") {
      deviceList = [
        "Blackberry PlayBook",
        "BlackBerry Z30",
        "Galaxy Note 3",
        "Galaxy Note II",
        "Galaxy S III",
        "Galaxy S5",
        "JioPhone 2",
        "Kindle Fire HDX",
        "LG Optimus L70",
        "Microsoft Lumia 550",
        "Microsoft Lumia 950",
        "Nexus 10",
        "Nexus 4",
        "Nexus 5",
        "Nexus 5X",
        "Nexus 6",
        "Nexus 6P",
        "Nexus 7",
        "Nokia Lumia 520",
        "Nokia N9",
        "Pixel 2",
        "Pixel 2 XL",
      ];
    } else {
      deviceList = [
        "iPad (gen 6)",
        "iPad (gen 7)",
        "iPad Mini",
        "iPad Pro 11",
        "iPhone 6",
        "iPhone 6 Plus",
        "iPhone 7",
        "iPhone 7 Plus",
        "iPhone 8",
        "iPhone 8 Plus",
        "iPhone SE",
        "iPhone X",
        "iPhone XR",
        "iPhone 11",
        "iPhone 11 Pro",
        "iPhone 11 Pro Max",
      ];
    }

    /*
----------------------------------------------------------------------
    <Set up List of Devices, Cycle through each device>


    */
    for (let deviceName of deviceList) {
      const testDevice = devices[deviceName];

      const browser = await playwright[browserType].launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const context = await browser.newContext({ ...testDevice });
      const page = await context.newPage();

      /*
    --------------------------------------------------------------------  
      Sign into user account
      

     */
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

      /*
-----------------------------------------------------------------------
      //clear user tracks for course progress of course [1851]

      */
      await page.goto("https://develop.alison.com/admin/users/16849349");
      await page.click("//html/body/div[2]/section[3]/div/div/div/ul/li[2]/a");
      await page.click(
        "//html/body/div[2]/section[3]/div/div/div/div/div[2]/div/div[2]/div/table/tbody/tr/td[8]/a"
      );
      await delay(1000);
      await page.click("//html/body/div[3]/div/div/div[3]/button[2]");
      await delay(2000);

      await page.goto("https://develop.alison.com/resume/courses/1851");

      /*
      -----------------------------------------------------------------
      //cycle through 7 topics and ensure module progress is updating as necessary

      1. Navigate to course

      2. Start Loop
      --> [Click Start
          Click Next Slide
          Grab Module Progress and ensure it's increasing
          Click Next Topic]
      
      3. Console Log Results


      */

      let count = 0;
      let countProgress = -1;
      let progress;
      let spanElement; //element for module progress % number

      console.log("------------------------------------------------<br><br>");
      console.log("Browser Type: " + browserType);
      console.log("Device: " + testDevice);

      while (count < 6) {
        try {
          //Wait for ad
          await delay(12000);
          //Click start button on a topic
          await page.click("#player_button_right");
          await delay(5000);
          const frame = page.frame("iframe");
          await delay(5000);

          const nextButton = await frame.$("//html/body/div/div/button[2]");
          await delay(5000);

          //Next Slide
          await frame.evaluate((el) => el.click(), nextButton);

          //Grab module progress score and ensure it is increasing
          progress = await page.$(".module-progress");
          spanElement = await progress.getProperty("innerText");
          spanElement = await spanElement.jsonValue();
          var progressNumber = spanElement.replace(/\D/g, "");
          console.log("Progress is: " + spanElement);
          if (progressNumber <= countProgress) {
            console.log("Module Progress not increasing for Topic" + count);
          }
          countProgress = progressNumber;
          count += 1;

          await delay(3500);
          //Navigate to next topic and continue cycle
          await frame.evaluate((el) => el.click(), nextButton);
        } catch (e) {
          console.log(e);
          break;
        }
      }
      console.log(
        "--------------------END OF BROWSERTYPE & DEVICE---------------------<br><br>"
      );
      await browser.close();
    }
  }
})();

//used to add delays for ads and slow loading elements
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
