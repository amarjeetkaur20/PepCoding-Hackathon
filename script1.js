const puppy = require("puppeteer");
var nodemailer = require('nodemailer');

const id = "gigan.saddal@gmail.com";
const pass = "Gigan@1234";

let topics = ["Maths","Science","English","Computer"];

let time = 18;

async function main(){
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });
    let tabs = await browser.pages();
    let tab = tabs[0];
    await tab.goto("https://www.gotomeeting.com/en-in/meeting/sign-in");
    
    await tab.waitForSelector(".fieldContainerFirst",{visible: true});
    await tab.type('input[type="email"]', id);
    await tab.click('input[type="button"]');
    
    await tab.waitForSelector(".fieldContainer",{visible: true});
    await tab.type('input[type="password"]', pass);
    await tab.click('input[type="submit"]');
    
    for(let i = 0; i < 4;i++){
        await tab.waitForSelector(".MeetingsDashboard__Sidebar-sc-1dp26l9-1.fWKuvo",{visible: true});
        await scheduleMeeting("https://global.gotomeeting.com/#/meetings/upcoming-meetings", tab,topics[i]);
    }
    await takeScreenShots("https://global.gotomeeting.com/#/meetings/upcoming-meetings",tab);
    await browser.close();
    await sendMail();
}

async function scheduleMeeting(url,tab,topic){
    await tab.goto(url);
    await tab.waitForSelector('button[data-testid="create-meeting-button"]',{visible: true});
    await tab.click('button[data-testid="create-meeting-button"]');
    await tab.waitForSelector(".MeetingTab__MeetingNameInput-x34tqq-1.AfNIw",{visible: true});
    await tab.type(".MeetingTab__MeetingNameInput-x34tqq-1.AfNIw",topic);
    let dateTimeButtons = await tab.$$(".MeetingTab__InputIcon-x34tqq-16.jREXkl");
    
    await dateTimeButtons[0].click();
    await tab.click('div[aria-label="Choose Thursday, April 15th, 2021"]');
    
    await dateTimeButtons[1].click();
    let timeButtons = await tab.$$(".react-datepicker__time-list-item ")
    await timeButtons[time].click();
    
    await tab.click('button[data-testid="button-ok"]');
    await tab.waitForSelector(".MeetingDetailsWrapper__Description-q5iru0-4.gMJUMu",{
        visible: true,
        waitUntil: 'load',
        timeout: 0
    });
    time += 1;
}

async function takeScreenShots(url,tab){
    await tab.goto(url);

    await tab.waitForSelector(".CardList-qipl7p-0.fXbUYR",{visible: true});
    
    let images = ["maths.png","science.png","english.png","computer.png"];
    
    for(let j = 0; j < 4; j++){
        let list = await tab.$$(".Button__UnstyledButton-sc-1je6tck-1.jOvBAs.SelectableCard__Card-nn6u4c-0.bszoiJ");
        await list[j].click();

        await tab.waitForSelector(".react-select__control.css-yk16xz-control",{visible: true});
    
        await tab.screenshot(options = {
            path : 'images/'+ images[j],
            fullpage: true,
            omitBackground: true
        });
    }   
}

async function sendMail(){
    var mail = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gigan.saddal@gmail.com',
          pass: 'Gigan@1234'
        }
    });
      
    var mailOptions = {
        from: 'gigan.saddal@gmail.com',
        to: 'amarjeet.saddal10@gmail.com',
        subject: 'ONLINE CLASS SCHEDULE',
        html: '<h1>MEETING SCHEDULE</h1><p>Find below the details of each class</p>' ,
        attachments: [{
            filename: 'maths.png',
            path: "C:/PEPCODING/WEB D/Hackathon/images" + '/maths.png'
        },
        {
            filename: 'science.png',
            path: "C:/PEPCODING/WEB D/Hackathon/images" + '/science.png'
        }
        ,
        {
            filename: 'english.png',
            path: "C:/PEPCODING/WEB D/Hackathon/images" + '/english.png'
        }
        ,
        {
            filename: 'computer.png',
            path: "C:/PEPCODING/WEB D/Hackathon/images" + '/computer.png'
        }
    ]
    }
      
    mail.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email has been sent: ' + info.response);
            console.log('Thank you!!!');
        }
    });
}

main();