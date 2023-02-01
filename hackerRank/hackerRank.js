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
    let algorithmTabWillBeOpenPromise = waitAndClick("div[data-automation='algorithms']");
    return algorithmTabWillBeOpenPromise;
})
.then(function(){
    console.log("Algorithm Tab Opened");
    let allQuestionLoadedPromise = cTab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]');
    return allQuestionLoadedPromise;
})
.then(function(){
    function getAllQuestionLinks(){
        let allElemArray = document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
        let linksArr = [];
        for(let i = 0; i < allElemArray.length; i++){
            linksArr.push(allElemArray[i].getAttribute("href"));
        }
        return linksArr;
    }
    let linksArrPromise = cTab.evaluate(getAllQuestionLinks());
    return linksArrPromise;
})
.then(function(linksArr){
    console.log("Links Of All QuestionArray Recieved");
    console.log(linksArr);
})

.catch(function(err){
    console.log(err);
});






function waitAndClick(selector){
    let waitClickPromise = new Promise(function(resolve, reject){
        let contentLoadedromise = cTab.waitForSelector(selector);
        contentLoadedromise
        .then(function(){
            console.log("Algo Btn is Found");
            let clickNodePromise = cTab.click(selector);
            return clickNodePromise;
        })
        .then(function(){
            console.log("Algo Btn Clicked");
            resolve();
        })
        .catch(function(err){
            console.log(err);
        })
    })
    return waitClickPromise;
}