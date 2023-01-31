let { email, password } = require('./secrets');
const puppeteer = require("puppeteer");
// let email = secrets.email;
// let password = secrets.password;
let cTab = "";

let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport : null,
    args: ["--start-maximized"],
    // executablePath : "Application\chrome.exe"
})

browserOpenPromise.
then(function(browser){
    console.log("browser is open");
    // browser.pages return An array of all open pages inside the Browser.
    let allTabsPromise = browser.pages();
    return allTabsPromise; 
})
.then(function(allTabsArray){
    cTab = allTabsArray[0];
    let visitingLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromise;
})
.then(function(){
    console.log("HackerEarth page is opened");
    let emailTypedPromie = cTab.type("#input-1", email);
    return emailTypedPromie;
})
.then(function(){
    console.log("email is typed");
    let passwordTypedPromise = cTab.type("input[type = 'password']", password);
    return passwordTypedPromise;
})
.then(function(){
    console.log("Password Is Typed");
    let willbeLoggedIn = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
    return willbeLoggedIn;
})
.then(function(){
    console.log("Logged Into Hackerrank Successfully");
})