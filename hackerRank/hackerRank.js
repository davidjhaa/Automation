let { email, password } = require('./secrets');
const puppeteer = require("puppeteer");
let { answer } = require("./codes");
// let email = secrets.email;
// let password = secrets.password;
let cTab = "";

let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    // executablePath : "Application\chrome.exe"
})

browserOpenPromise.
    then(function (browser) {
        console.log("browser is open");
        // browser.pages return An array of all open pages inside the Browser.
        let allTabsPromise = browser.pages();
        return allTabsPromise;
    })
    .then(function (allTabsArray) {
        cTab = allTabsArray[0];
        let visitingLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login");
        return visitingLoginPagePromise;
    })
    .then(function () {
        console.log("HackerEarth page is opened");
        let emailTypedPromie = cTab.type("#input-1", email, {delay:100});
        return emailTypedPromie;
    })
    .then(function () {
        console.log("email is typed");
        let passwordTypedPromise = cTab.type("input[type = 'password']", password, {delay:100});
        return passwordTypedPromise;
    })
    .then(function () {
        console.log("Password Is Typed");
        let willbeLoggedIn = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
        return willbeLoggedIn;
    })
    .then(function () {
        console.log("Logged Into Hackerrank Successfully");
        let algorithmTabWillBeOpenPromise = waitAndClick("div[data-automation='algorithms']");
        return algorithmTabWillBeOpenPromise;
    })
    .then(function () {
        console.log("Algorithm Tab Opened");
        let allQuestionLoadedPromise = cTab.waitForSelector('a[data-analytics="ChallengeListChallengeName"]');
        return allQuestionLoadedPromise;
    })
    .then(function () {
        function getAllQuestionLinks() {
            let allElemArray = document.querySelectorAll("a[data-analytics='ChallengeListChallengeName']");
            let linksArr = [];
            for (let i = 0; i < allElemArray.length; i++) {
                linksArr.push(allElemArray[i].getAttribute("href"));
            }
            return linksArr;
        }
        let linksArrPromise = cTab.evaluate(getAllQuestionLinks);
        return linksArrPromise;
    })
    .then(function (linksArr) {
        console.log("Links Of All QuestionArray Recieved");
        console.log(linksArr);
        // question is to be solved
        let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
        // for(let i = 1; i < linksArr.length; i++){
            // questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function(){
                // console.log(`question Number${i-1}solved`);
                // return questionSolver(linksArr[i], i);
            // })
        // }
        return questionWillBeSolvedPromise;
    })
    .then(function () {
        console.log("Question Solved Succesfully");
    })

    .catch(function (err) {
        console.log(err);
    });






function waitAndClick(selector) {
    let waitClickPromise = new Promise(function (resolve, reject) {
        let contentLoadedromise = cTab.waitForSelector(selector);
        contentLoadedromise
            .then(function () {
                console.log("Algo Btn is Found");
                let clickNodePromise = cTab.click(selector);
                return clickNodePromise;
            })
            .then(function () {
                console.log("Algo Btn Clicked");
                resolve();
            })
            .catch(function (err) {
                console.log(err);
            })
    })
    return waitClickPromise;
}

function questionSolver(url, idx) {
    return new Promise(function (resolve, reject) {
        let fullLink = `https://www.hackerrank.com${url}`;
        let questionOpenedPromise = cTab.goto(fullLink);
        questionOpenedPromise
            .then(function () {
                console.log("Question opened");
                //tick the custom input box mark
                let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
                return waitForCheckBoxAndClickPromise;
            })
            .then(function () {
                //select the box where code will be typed
                let waitForTextBoxPromise = cTab.waitForSelector(".custominput");
                return waitForTextBoxPromise;
            })
            .then(function () {
                // type the code in textbox Area
                let codeTypedPromise = cTab.type(".custominput", answer[idx], {delay:100});
                return codeTypedPromise;
            })
            .then(function () {
                // select all the text written in customInput Area
                let controlKeyPressedPromise = cTab.keyboard.down("Control");
                return controlKeyPressedPromise;
            })
            .then(function () {
                let aKeyPressedPromise = cTab.keyboard.press("a");
                return aKeyPressedPromise;
            })
            .then(function () {
                let xKeyPressedPromise = cTab.keyboard.press("x");
                return xKeyPressedPromise;
            })
            .then(function () {
                let ctrlKeyReleasedPromise = cTab.keyboard.up("Control");
                return ctrlKeyReleasedPromise;
            })
            .then(function () {
                // select the editor 
                let editorSelectedPromise = cTab.click(".monaco-editor.no-user-select.vs");
                return editorSelectedPromise;
            })  //pasting in editor started
            .then(function () {
                let controlKeyPressedPromise = cTab.keyboard.down("Control");
                return controlKeyPressedPromise;
            })
            .then(function () {
                let aKeyPressedPromise = cTab.keyboard.press("a",{delay:100});
                return aKeyPressedPromise;
            })
            .then(function(){
                let vKeyPressedPromise = cTab.keyboard.press("v",{delay:100});
            })
            .then(function () {
                let ctrlKeyReleasedPromise = cTab.keyboard.up("Control");
                return ctrlKeyReleasedPromise;
            })
            .then(function () {
                let submitButtonClickedPromise = cTab.click(".hr-monaco-submit");
                return submitButtonClickedPromise;
            })
            .then(function () {
                console.log("Code Submitted SuccessFully");
                resolve();
            })
            .catch(function (err) {
                reject(err);
            })
    })
}