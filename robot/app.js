
// For CSP 

// document.querySelector('body').addEventListener('click', function(event) {
//     if (event.target.tagName.toLowerCase() === 'li') {
//       // do your action on your 'li' or whatever it is you're listening for
//     }
//   });


let headerOfPrice = "قیمت به تومان"
let headerOfproductName = "نام محصول"
let headerOfAmount = "موجودی"
let headerOfAmountUnit = "واحد موجودی"
let headerOfPic = "تصاویر"
let headerOfCategory = "دسته بندی"
let headerOfId = "کد محصول"
let headerOfDescription = "توضیحات"
let headerOfMadeIn = "تولید"
let numberOfHeaders = 9

// هزینه های اضافی مانند پست و مالیات و غیره. در صورت صفر بودن، در سفارش نهایی به کاربر نشان داده نمیشود.
let extraCosts = {
    // cost should be numeric
    cost: 60000,
    reason: "هزینه پست"
}

// Links
let prdApp = "https://script.google.com/macros/s/AKfycbzcI7qKnCFJFPVswVKK94I_7zXHZo2iMR1TuvM7NGMAIFGaglILLuzmi_O3Erv2Llkb/exec"
const prdSheetMain = "https://docs.google.com/spreadsheets/d/1zlG_M5bzeoEZRrQ_kd4Nw2oXZwBrZ66hD2A2u1zZuT4/gviz/tq?tqx=out:csv&sheet=main_in"
const prdSheetForm = "https://docs.google.com/spreadsheets/d/1zlG_M5bzeoEZRrQ_kd4Nw2oXZwBrZ66hD2A2u1zZuT4/gviz/tq?tqx=out:csv&sheet=form_responses"
const staSheet = "https://docs.google.com/spreadsheets/d/1BkMqKADw-bs9dTYBXOOuTc-Mx3ajlGE-3XvyHOWPALw/gviz/tq?tqx=out:csv&sheet=orderStatus"
// const chat_log_link = "https://script.google.com/macros/s/AKfycbxDi25h8jeEeKRRLkncmi4-3Q8fP1KgJPnWygCME8MkKir1xP4qTiz2Y8L9C1VPPxYw/exec"


// instagram and telegram id
let telegramId = "@Demo"
let instagramId = "@Demo"

let firstBotMessage = "سلام. خوش اومدین. من میتونم به سوالاتون جواب بدم و سفارشتونو ثبت کنم."

let defaultBotMessageBgColor = "white"
let defaultBotMessageColor = "black"


// let chatColumn1 = "پیام کاربر"
// let chatColumn2 = "پیام ربات"
// let chatColumn3 = "شماره کاربر"
// let chatColumn4 = "زمان"
// let chatColumn5 = "پیام درک نشده"
// let chatColumn6 = "لیست پاسخ ربات"
let info = {
    No1 : ["نام و نام خانوادگی" , ''],
    No2 : ["آیدی اینستاگرام" , ''],
    No3 : ["شماره تلفن" , ''],
    No4 : ["آدرس" , '']
}
let newQandA = null
let faqList = []
let newQandAFunctions = ''
let cardNumber
let cardNumberOwner
let checkOrderList = []
let botNewName
let fetchObject = {}
let dataBase = {}

function loadSheet(){
    fetch(prdSheetMain)
    .then(result=>result.text())
    .then(function(csvtext) {
        return csv().fromString(csvtext)
    })
    .then(function(csv){
        newQandA = []
        csv.forEach(function(row){
            if (row.سوالات != "" && row.پاسخ_ها != ""){
                newQandA.push([row.سوالات.split(/[,،]+/) , row.پاسخ_ها.split(/[,،]+/)])
            }
            if (row.سوالات_متداول != ""){
                faqList.push(row.سوالات_متداول);
            }
            if (row.اطلاعات_دریافتی != ""){
                info["No" + (csv.indexOf(row)+1)]= [row.اطلاعات_دریافتی,""]
            }
            if (row.کلمات_کلیدی != "" && row.کلمات_کلیدی.includes(":")){
                let newWDYM = {
                    Qs : [],
                    As : [],
                    listGame : false
                }
                newWDYM.Qs = row.کلمات_کلیدی.split(":")
                newWDYM.As = newWDYM.Qs[1].split(/[,،]+/)
                newWDYM.Qs = newWDYM.Qs[0].split(/[,،]+/)
                if(newWDYM.Qs[0] != "" && newWDYM.As[0] != "") {
                    WDYM.push(newWDYM)
                }
            }
        })
        document.getElementById('botNameLabel').innerHTML = csv[0].اسم_ربات
        document.getElementById('contactOwnerName').innerHTML = csv[0].اسم_ربات + " :"
        
        botNewName = csv[0].اسم_ربات
        // To set the Bot's profile Picture
        document.getElementById('headerImg').innerHTML = imgUrl2Tag(csv[0].عکس_پروفایل)
        document.getElementById('headerImg').children[0].setAttribute("alt","")

        // To set instagram and telegram id
        telegramId = csv[0].ایدی_تلگرام
        document.getElementById("telId").innerHTML = telegramId
        document.getElementById("telId"). setAttribute('href', `https://t.me/${telegramId.substring(1,100)}`)

        instagramId = csv[0].ایدی_اینستاگرام
        document.getElementById("instaId").innerHTML = instagramId
        document.getElementById("instaId"). setAttribute('href', `https://instagram.com/${instagramId.substring(1,100)}`)

        // To set cardNumber and cardNumber Owner
        cardNumber = csv[0].شماره_کارت
        cardNumberOwner = csv[0].صاحب_کارت


        // To set Background Image
        document.getElementById("messages").style.backgroundImage = "url('" + imgTag2Url(imgUrl2Tag(csv[0].عکس_پس_زمینه)) + "')"

    })

    // Things to do after loading the sheet
    .then(function(){
        document.getElementById("firstMessage").innerHTML = firstBotMessage
        
        // To add pics as answers
        for(let i in newQandA){
            for(let j in newQandA[i][1]){
                if(newQandA[i][1][j].includes("https://drive.google")){
                    newQandA[i][1][j] = '<div class="answerWithImg">' + imgUrl2Tag(newQandA[i][1][j]) + "</div>"
                }
            }
        }
        // To add additional questions and answers
        for(let i=0; i<newQandA.length; i++) {
            allObjs[`newQandA${i+1}Obj`] = {}
            allObjs[`newQandA${i+1}Obj`].questions = [...newQandA[i][0]]
            allObjs[`newQandA${i+1}Obj`].allAnswers = [...newQandA[i][1]]
            allObjs[`newQandA${i+1}Obj`].listGame = false
            allObjs[`newQandA${i+1}Obj`].listCounter = 0

            allObjsBU[`newQandA${i+1}Obj`] = {}
            allObjsBU[`newQandA${i+1}Obj`].questions = [...newQandA[i][0]]
            allObjsBU[`newQandA${i+1}Obj`].allAnswers = [...newQandA[i][1]]
            allObjsBU[`newQandA${i+1}Obj`].listGame = false
            allObjsBU[`newQandA${i+1}Obj`].listCounter = 0

            newQandAFunctions += `mainTalkBotF(allObjs.newQandA${newQandA.length-i}Obj,allObjsBU.newQandA${newQandA.length-i}Obj,"newQandA${newQandA.length-i}Obj");\n`
            allAs.push(...allObjs[`newQandA${i+1}Obj`].allAnswers)
        }
        // To add faq
        faqH2 = document.getElementById("faq")
        if (faqList.length > 0) {
            faqH2.innerHTML = ""
            for (let i = 0; i < faqList.length; i++) {
                faqH2.innerHTML += `<h3 class="btn-primary faqClass" onclick="doWhatISay('${String(faqList[i])}');">` + faqList[i] + "</h3>"
            }
            faqH2.innerHTML += `<button class="btn-outline-danger faqClass faqClass2" onclick="doWhatISay('جست و جوی محصولات')">
            
            <span>
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="height: 30px;width: 36px;padding-left: 5px;" xml:space="preserve">
            <circle style="fill:#FF2746;" cx="256" cy="256" r="256"></circle>
            <path style="fill:#940030;" d="M374.705,137.85L114.59,396.964l113.519,113.519C237.271,511.476,246.574,512,256,512
                c135.171,0,245.86-104.765,255.331-237.523L374.705,137.85z"></path>
            <path style="fill:#263A7A;" d="M107.744,380.121c0-6.177,2.357-12.354,7.07-17.065l113.778-113.778
                c9.425-9.426,24.707-9.426,34.132,0c9.425,9.425,9.425,24.707,0,34.132L148.945,397.188c-9.425,9.426-24.707,9.426-34.132,0
                C110.101,392.475,107.744,386.298,107.744,380.121z"></path>
            <path style="fill:#121149;" d="M262.409,248.801L114.552,396.66c0.164,0.172,0.307,0.359,0.478,0.528
                c9.425,9.426,24.707,9.426,34.132,0L262.939,283.41c9.425-9.425,9.425-24.707,0-34.132
                C262.768,249.108,262.584,248.963,262.409,248.801z"></path>
            <circle style="fill:#FFFFFF;" cx="302.545" cy="209.455" r="85.333"></circle>
            <path style="fill:#E5E4E3;" d="M362.37,148.625L241.714,269.281c15.481,15.739,37.011,25.509,60.83,25.509
                c47.128,0,85.333-38.205,85.333-85.333C387.879,185.635,378.109,164.104,362.37,148.625z"></path>
            <path style="fill:#366695;" d="M200.835,209.455c0-56.082,45.628-101.71,101.71-101.71s101.71,45.628,101.71,101.71
                s-45.628,101.71-101.71,101.71S200.835,265.537,200.835,209.455z M371.502,209.455c0-38.022-30.934-68.956-68.956-68.956
                s-68.956,30.934-68.956,68.956s30.934,68.956,68.956,68.956S371.502,247.477,371.502,209.455z"></path>
            <path style="fill:#273B7A;" d="M373.917,137.078l-23.15,23.15c12.783,12.524,20.735,29.961,20.735,49.226
                c0,38.022-30.934,68.956-68.956,68.956c-19.266,0-36.702-7.952-49.226-20.735l-23.15,23.15
                c18.456,18.713,44.08,30.339,72.376,30.339c56.082,0,101.71-45.628,101.71-101.71C404.256,181.158,392.63,155.534,373.917,137.078z"></path>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            </svg>
            </span>جست و جوی محصولات 

        </button>
        
        
        
        
        
        
        <br><button class="btn-success faqClass faqClass2" onclick="doWhatISay('لیست محصولات')">
        
        <span>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 502 502" style="height: 30px;width: 36px;padding-left: 5px;" xml:space="preserve">
    <g>
        <g>
            <g>
                <path style="fill:#D1DCEB;" d="M462,161H159c-16.568,0-30-13.432-30-30s13.432-30,30-30h303c16.568,0,30,13.432,30,30
                    S478.568,161,462,161z"></path>
                <path d="M462,171H159c-22.056,0-40-17.944-40-40s17.944-40,40-40h303c22.056,0,40,17.944,40,40S484.056,171,462,171z M159,111
                    c-11.028,0-20,8.972-20,20s8.972,20,20,20h303c11.028,0,20-8.972,20-20s-8.972-20-20-20H159z"></path>
            </g>
        </g>
        <g>
            <g>
                <path style="fill:#D1DCEB;" d="M462,281H159c-16.568,0-30-13.432-30-30s13.432-30,30-30h303c16.568,0,30,13.432,30,30
                    S478.568,281,462,281z"></path>
                <path d="M462,291H159c-22.056,0-40-17.944-40-40s17.944-40,40-40h303c22.056,0,40,17.944,40,40S484.056,291,462,291z M159,231
                    c-11.028,0-20,8.972-20,20c0,11.028,8.972,20,20,20h303c11.028,0,20-8.972,20-20s-8.972-20-20-20H159z"></path>
            </g>
        </g>
        <g>
            <g>
                <path style="fill:#D1DCEB;" d="M462,401H159c-16.568,0-30-13.432-30-30s13.432-30,30-30h303c16.568,0,30,13.432,30,30
                    S478.568,401,462,401z"></path>
                <path d="M462,411H159c-22.056,0-40-17.944-40-40s17.944-40,40-40h303c22.056,0,40,17.944,40,40S484.056,411,462,411z M159,351
                    c-11.028,0-20,8.972-20,20s8.972,20,20,20h303c11.028,0,20-8.972,20-20s-8.972-20-20-20H159z"></path>
            </g>
        </g>
        <g>
            <circle style="fill:#4EC9DC;" cx="49" cy="131" r="39"></circle>
            <path d="M49,180c-27.019,0-49-21.981-49-49s21.981-49,49-49s49,21.981,49,49S76.019,180,49,180z M49,102
                c-15.991,0-29,13.009-29,29s13.009,29,29,29s29-13.009,29-29S64.991,102,49,102z"></path>
        </g>
        <g>
            <circle style="fill:#4EC9DC;" cx="49" cy="251" r="39"></circle>
            <path d="M49,300c-27.019,0-49-21.981-49-49s21.981-49,49-49s49,21.981,49,49S76.019,300,49,300z M49,222
                c-15.991,0-29,13.009-29,29s13.009,29,29,29s29-13.009,29-29S64.991,222,49,222z"></path>
        </g>
        <g>
            <circle style="fill:#4EC9DC;" cx="49" cy="371" r="39"></circle>
            <path d="M49,420c-27.019,0-49-21.981-49-49s21.981-49,49-49s49,21.981,49,49S76.019,420,49,420z M49,342
                c-15.991,0-29,13.009-29,29s13.009,29,29,29s29-13.009,29-29S64.991,342,49,342z"></path>
        </g>
        <g>
            <path d="M387,139H216c-5.523,0-10-4.477-10-10s4.477-10,10-10h171c5.523,0,10,4.477,10,10C397,134.523,392.523,139,387,139z"></path>
        </g>
        <g>
            <path d="M176,139h-18c-5.523,0-10-4.477-10-10s4.477-10,10-10h18c5.523,0,10,4.477,10,10C186,134.523,181.523,139,176,139z"></path>
        </g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    <g>
    </g>
    </svg>
    
    
        
    </span>لیست محصولات
        
        </button><br><button class="btn-outline-danger faqClass faqClass2" onclick="doWhatISay('پیگیری سفارش❓')" style="display:none;">پیگیری سفارش❓</button>`
        }
        else {
            document.getElementById("faqDiv").style.display = 'none';
        }
        // To delete reconnectMessages
        if(document.getElementById("reconnectMessage")) {
            document.getElementById("reconnectMessage").innerHTML = '';
        }

        loadProductsSheet()
    })
    .catch(function(e){
        console.log(e);
        if(!document.getElementById("reconnectMessage")){
            let botMessageD = document.createElement("div");
            botMessageD.classList.add("botMessage");
            botMessageD.setAttribute("id", "reconnectMessage");
            let botMessageBox = document.createElement("div");
            botMessageBox.classList.add("botMessageBox");
            let botMessageText = document.createElement("h4")
            botMessageBox.appendChild(botMessageText)
            botMessageD.appendChild(botMessageBox)
            document.getElementById("messagesArea").appendChild(botMessageD)
        }
        document.getElementById("reconnectMessage").children[0].children[0].innerHTML = `اتصال به سرور برقرار نشد. لطفا اتصال اینترنت خود را بررسی کنید و دکمه زیر را لمس کنید.
        <br><button class="btn btn-primary" onclick="loadSheet();document.getElementById('reconnectMessage').children[0].children[0].innerHTML=` + `'در حال تلاش مجدد...'`+ ` ">تلاش مجدد</button>`
    })
}
loadSheet()
function loadProductsSheet(){
    fetch(prdSheetForm)
    .then(result=>result.text())
    .then(function(csvtext) {
        return csv().fromString(csvtext)
    })
    .then(function(csv){
        fetchObject = {}
        csv.forEach(function(row){
            if (row[headerOfproductName] != ""){
                fetchObject[row[headerOfId]] = {}
                for(let i=1 ; i<= numberOfHeaders ; i++){
                    fetchObject[row[headerOfId]][Object.keys(row)[i]] = row[Object.keys(row)[i]]
                }
            }
        })
        if(document.getElementById("reconnectMessage")) {
            document.getElementById("reconnectMessage").innerHTML = '';
        }

        for(let key in fetchObject){
            // fetchObject[key]["شماره محصول"] = Object.keys(fetchObject).indexOf(key)
            fetchObject[key][headerOfPic] = fetchObject[key][headerOfPic].split(", ").map(function(e){
                return imgUrl2Tag(e)
            }) 
            fetchObject[key][headerOfDescription] ? console.log("yes") : fetchObject[key][headerOfDescription] = "-"
            fetchObject[key][headerOfDescription] = "🔹" + fetchObject[key][headerOfDescription].replaceAll("\n","<br>🔹")
            fetchObject[key][headerOfDescription] = fetchObject[key][headerOfDescription].replaceAll("<br>🔹<br>","<br><br>")

        }
        updateDataBase()
        loadCart()

    })
    .catch(function(e){
        let htmlCode = `
        <div class="botMessageBox">
            <h3>
            اتصال به سرور برقرار نشد. لطفا اتصال اینترنت خود را بررسی کنید و دکمه زیر را لمس کنید.
            <br><button class="btn btn-primary" onclick="loadProductsSheet();document.getElementById('reconnectMessage').innerHTML='<div class= &quot; botMessageBox &quot; ><h3>در حال تلاش مجدد...</h3></div>'`
            
            + ` ">تلاش مجدد</button>
            </h3>
        </div>
        `
        console.log(e);
        if(!document.getElementById("reconnectMessage")){
            let botMessageD = document.createElement("div");
            botMessageD.classList.add("botMessage");
            botMessageD.setAttribute("id", "reconnectMessage");
            document.getElementById("messagesArea").appendChild(botMessageD)
        }
        document.getElementById("reconnectMessage").innerHTML = htmlCode
    })
}

function productInfo(productId) {
    let productInfoObject = JSON.parse(JSON.stringify(fetchObject[productId])) 
    // delete productInfoObject["شماره محصول"]
    let thisProductAmount = Number(productInfoObject[headerOfAmount])
    productInfoObject[headerOfAmount] = productInfoObject[headerOfAmount] + " " + productInfoObject[headerOfAmountUnit]
    productInfoObject[headerOfPrice] = num3Digit(productInfoObject[headerOfPrice]) + " تومان"
    productInfoObject["قیمت" + " هر " + productInfoObject[headerOfAmountUnit]] = productInfoObject[headerOfPrice]
    delete productInfoObject[headerOfPrice]
    delete productInfoObject[headerOfAmountUnit]
    let answer = ""
    let numberOfPics = productInfoObject[headerOfPic].length
    if(numberOfPics == 1){
        answer = `
        <div class="productInfoImgDiv">
            ${productInfoObject[headerOfPic][0]}
        </div>`
    }
    else{
        answer = `
        <div class="gallery" style="
            position: relative;
            margin-top: 0;
            margin-bottom: 10px;
        ">
        <img src="./arrow2.png" style="
        position: absolute;
        width: 24px;
        right: 0;
        top: 50%;
        transform: rotate(180deg) translate(5px, 50%);
        z-index: 99;
        opacity: 0.7;
        /* filter: drop-shadow(0px 0px 2px white); */
        box-shadow: 0px 0px 2px 2px #ffffffcc;
        background-color: #ffffffba;
    " class="arrowImg">
<img src="./arrow2.png" style="
        position: absolute;
        width: 24px;
        left: 0;
        top: 50%;
        transform: translate(5px, -50%);
        z-index: 99;
        opacity: 0.7;
        /* filter: drop-shadow(0px 0px 2px white); */
        box-shadow: 0px 0px 2px 2px #ffffffcc;
        background-color: #ffffffba;
    " class="arrowImg">
            <div class="galleryDiv">
        `
        for(let picTag in productInfoObject[headerOfPic]){
            answer +=`
            <div class="galleryElement" style="cursor:initial;">
                <div class="productInfoImgDiv galleryElementImgDiv">
                    ${productInfoObject[headerOfPic][picTag]}
                </div>
            </div>
                
            `
        }
        answer += `
        </div></div>
        `
    }
    delete productInfoObject[headerOfPic]
    delete productInfoObject[headerOfCategory]
    delete productInfoObject[headerOfId]
    for(let key in productInfoObject){
        if(key != headerOfDescription){
            answer += `<strong>${key} :</strong> ${productInfoObject[key]}<div class="heightSpaceDiv"></div>`
        }
        else{
            if(productInfoObject[key] == "🔹-"){
                productInfoObject[key] = "-"
                answer += `<strong>${key} :</strong> ${productInfoObject[key]}<div class="heightSpaceDiv"></div>`
            }
            else{
                answer += `
                <div class="descDiv" style="cursor:pointer;">
                    <strong>${key} :</strong>
                    <small style="font-weight: lighter; color: royalblue;">(برای دیدن توضیحات ضربه بزنید)</small>    
                </div>
                <div style="display:none;color: midnightblue;"><small>${productInfoObject[key]}</small></div>
                <div class="heightSpaceDiv"></div>
                `
            }
        }
    }
    console.log(thisProductAmount);
    if(!orderCart.orderInProgress){
        if(thisProductAmount >= 1){
            answer += `
            <div style="text-align: center; margin-top: 12px;" >
                <div class="addToCartBtnDiv">
                    <button onclick="handleAddToCartBtn('${productId}',this)" class="btn btn-success galaxyBg">افزودن به سبد خرید</button>
                </div>
            </div>
            `
        }
        else{
            answer += `
            <div style="text-align: center; margin-top: 12px;" >
            <span style="color:red;">بدون موجودی</span>
            </div>
            `
        }
    }
    sendBotMessage(answer,"black","white", "100%")
    if(numberOfPics == 1){
        let lastImg =document.querySelectorAll(".productInfoImgDiv")[document.querySelectorAll(".productInfoImgDiv").length -1].children[0]
        lastImg.style.margin = "-10px -10px 10px"
        lastImg.parentElement.parentElement.parentElement.style.maxWidth = String(lastImg.offsetWidth) + "px"
        lastImg.parentElement.parentElement.style.lineHeight = "1.3"
    }
    else{
        let lastImg =document.querySelectorAll(".productInfoImgDiv")[document.querySelectorAll(".productInfoImgDiv").length -1].children[0]
        // lastImg.style.margin = "-10px -10px 10px"
        lastImg.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.maxWidth = String(lastImg.offsetWidth + 20) + "px"
        lastImg.parentElement.parentElement.parentElement.parentElement.parentElement.style.lineHeight = "1.3"
        hideArrows(0)
    }
    let descDiv = document.querySelectorAll(".descDiv")[document.querySelectorAll(".descDiv").length - 1]
    $(descDiv).on("click", function(){
        
        descDiv.children[1]? descDiv.children[1].remove() : 1;
        let span = descDiv.nextElementSibling
        span.style.display == "none" ? $(span).slideDown(400,function(){
            // moveMessages(1)
            console.log(descDiv.parentElement.parentElement.parentElement);
            let isLastMessage = descDiv.parentElement.parentElement.parentElement == document.querySelectorAll(".botMessage")[document.querySelectorAll(".botMessage").length - 1] ? true : false
            // document.getElementById("messages").scrollTo(0, descDiv.parentElement.parentElement.parentElement.offsetTop - 240)
            isLastMessage ? moveMessages(1) : 1
        }) : 1
    })
}

function showMeThisProductGroup(group){
    let productsList = ""
    if(dataBase[group].length > 1){
        productsList = `<div class="galleryHtml">
        <img src="./arrow2.png" style="
                    position: absolute;
                    width: 24px;
                    right: 0;
                    top: 50%;
                    transform: rotate(180deg) translate(5px, -50%);
                    z-index: 99;
                    opacity: 0.7;
                    /* filter: drop-shadow(0px 0px 2px white); */
                    box-shadow: 0px 0px 2px 2px #ffffffcc;
                    background-color: #ffffffba;
                " class="arrowImg">
            <img src="./arrow2.png" style="
                    position: absolute;
                    width: 24px;
                    left: 0;
                    top: 50%;
                    transform: translate(5px, 50%);
                    z-index: 99;
                    opacity: 0.7;
                    /* filter: drop-shadow(0px 0px 2px white); */
                    box-shadow: 0px 0px 2px 2px #ffffffcc;
                    background-color: #ffffffba;
                " class="arrowImg">
        <strong>لطفا یکی از محصولات زیر را انتخاب کنید:</strong><div class="gallery"><div class="galleryDiv">`
    }
    else{
        productsList = `<div class="galleryHtml"><strong>تنها یک محصول یافت شد:</strong><div class="gallery"><div class="galleryDiv">`
    }
    dataBase[group].forEach(function(productId){
        productsList += `<div onclick="productInfo('${productId}')" class="galleryElement"><div class="galleryElementImgDiv">${fetchObject[productId][headerOfPic][0]}</div><div class="galleryElementText"><h3 ${fetchObject[productId][headerOfAmount] > 0 ? "" : 'style="color:red"'}>${fetchObject[productId][headerOfproductName]}</h3></div></div>`
    })
    // if(dataBase[group].length > 1){
    //     productsList += '</div>(برای دیدن بقیه محصولات به سمت راست بکشید)</div></div>'
    // }
    // else{
        productsList += '</div></div></div>'
    // }
    sendBotMessage(productsList,"black","white","100%")
    hideArrows(1)
}

function imgUrl2Tag(url){
    if(url.includes("https://drive.google.com/open")){
        tag = '<img src="https://drive.google.com/uc?id=' + url.substring(33) + '" alt="خطا" >'
    }
    else if(url.includes("https://drive.google.com/file/d")){
        tag = '<img src="https://drive.google.com/uc?id=' + url.substring(32,65) + '" alt="خطا" >'
    }
    else{
        tag = '<img src="' + url + '" alt="خطا" >'
    }
    return tag
}

function str2Number(str){
    let str2 = ""
    for(let i=0; i<str.length; i++){
        if(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(str[i])){
            str2 += str[i];
        }
    }
    return str2;
}



document.getElementById("optionsButton").addEventListener("click", ()=>{
    var x = document.getElementById("optionsList");
    $(x).fadeToggle(100);
})

document.getElementById("overlayDiv").addEventListener("click", ()=>{
    hideCart()
})

document.getElementById("ordersBagImg").addEventListener("click", ()=>{
    var x = document.getElementById("ordersBagDiv");
    // if(x.style.display == "none"){
    //     cartIconIsClicked = true
    // }
    x.style.display == "none" ? showCart() : hideCart()
})
document.getElementById("messages").addEventListener("click",()=>{
    if (document.getElementById("optionsList").style.display !== "none") {
        $("#optionsList").fadeOut(100)
    }
    // $("#ordersBagDiv").fadeOut(100, function(){
    //     document.querySelector("#previousOrdersDiv").style.display = "none"
    //     document.querySelector("#cartH3Span").style.transform = "rotate(0deg)"
    //     document.querySelector("#previousOrdersH3Span").style.transform = "rotate(0deg)"
    // })
})

function moveMessages(x){
    setTimeout(()=>{
        messages.scroll({
            top: messages.scrollHeight,
            behavior: "smooth"
        });
    },x)

}

// Start of allObjs
const allObjsBU = {
    // Start of inside of allObjs
SALAMObj: {
questions: [
    'سلام'
],
allAnswers: [
    'سلام'
],
listGame: false,
listCounter: 0},

productListObj: {
questions: [
        'سفارش',
        'محصول'
],
allAnswers: [
'لطفا چند ثانیه صبر کرده و دوباره تلاش کنید.'
],
listGame: false,
listCounter: 0},

KHUBIObj: {
questions: [
    'خوبی',
        'چطوری',
        'حالت خوبه',
        'حالت چطوره'
],
allAnswers: [
    'خوبم ممنون',
        'مرسی شما خوبی',
        'خوبم مرسی'
],
listGame: false,
listCounter: 0},

SABADKHARIDObj: {
    questions: [
        'سبد',
    ],
    allAnswers: [
        `
        <button class="btn btn-lg btn-primary" onclick="showCart()">مشاهده سبد خرید</button>
        `
    ],
    listGame: false,
    listCounter: 0},

previousOrdersObj: {
    questions: [
        'سفارش قبل',
        'سفارشات قبل',
        'سفارشات من',
        'وضعیت',
        'پیگیری سفارش',
        'کی سفارشم حاضر میشه؟',
        "کی ارسال میشه؟"
    ],
    allAnswers: [
        `
        برای دیدن وضعیت سفارشاتتون، از دکمه زیر استفاده کنید
        <br>
        <button class="btn btn-primary" onclick="
        updateOrdersStatus();  
        showCart();
        $('#previousOrdersDiv').slideDown(300);
        document.querySelector('#previousOrdersH3Span').style.transform = 'rotate(-90deg)';
        ">مشاهده سفارشات قبلی</button>
        `
    ],
    listGame: false,
    listCounter: 0},

    // Inside allObjs

}
const allObjs = JSON.parse(JSON.stringify(allObjsBU));
// End of allObjs

// Start of sugQs
const sugQs = [
    // Inside sugQs
    'رباتی؟'
]
// End of sugQs

// میتونم از هر لیست یچیز خاص اضافه کنم

// Start of noAnswerList
const noAnswerList = [
    // Inside noAnswerList
    // "متوجه نشدم :(",
    `متوجه منظورت نشدم. اگه سوالی داری که من نمیفهمم لطفا توی دایرکت اینستاگرام بپرس🌹
    <br><div style="height:10px;"></div>
    <button class="btn btn-primary" onclick="doWhatISay('لیست محصولات')">لیست محصولات</button>
    <button class="btn btn-warning" onclick="doWhatISay('جست و جوی محصولات')">جست و جوی محصولات</button>
    <button class="btn btn-success galaxyBg" onclick="showCart()">مشاهده سبد خرید</button>
    `
]
// End of noAnswerList

// Start of allAs
const allAs = [
    ...noAnswerList 
    // Inside allAs
]
// End of allAs

// Start of autoAsBu
const autoAsBU = [
    // Inside autoAsBu
    'سلااام کجایی'
]
// End of autoAsBu
const autoAs = JSON.parse(JSON.stringify(autoAsBU));



// for Pressing Enter in input
document.getElementById("whatYouSay").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        doWhatISay(this.value);
        
    }
});
let userMessage = '';
let userMessage2 = '';
let answerIsGiven = true;
let suggessionDiv = document.createElement("div")
let typingTime = 500
let bot_delay_time = 1
function doWhatISay(x,words = []){
    if(x == ""){
        itsvoiceMessage = false
        return
    }
    if(document.getElementById("sendButtonImage").classList.contains("onTextInput1")){
        setTimeout(function(){
            document.getElementById("sendButtonImage").classList.remove("onTextInput1")
            document.getElementById("micImage").classList.remove("onTextInput2")
            document.getElementById("sendButtonImage").classList.add("onTextInput11")
            document.getElementById("micImage").classList.add("onTextInput22")
        },250)
    }
    moveMessages(10)
    answerIsGiven = false;
    //to change special characters
    userMessage = ''
    userMessage2 = x;
    characterChanger()

    // for similarity
    if(words.length == 0){
        words = userMessage.split(" ")
    }
    // for users message
    userMessageF()
    document.getElementById('whatYouSay').value = '';
    bot_delay_time = Math.floor(Math.random() * 4000)
    bot_delay_time = 1
    setTimeout(function (){
        setTimeout(function () {
            searchInProducts()
            orderCart()
            // checkOrder()

        //محل بالا رده

            eval(newQandAFunctions)
            //محل میان رده
            
            mainTalkBotF(allObjs.previousOrdersObj,allObjsBU.previousOrdersObj,"previousOrdersObj")
            mainTalkBotF(allObjs.productListObj,allObjsBU.productListObj,"productListObj")

            //محل پایین م رده
            mainTalkBotF(allObjs.KHUBIObj,allObjsBU.KHUBIObj,"KHUBIObj")
            mainTalkBotF(allObjs.SALAMObj,allObjsBU.SALAMObj,"SALAMObj")
        
            //محل آخر آخر
            
            
            
            //محل آخرترتر
            
            
            
            //محل از آخر هم آخرتر
            mainTalkBotF(allObjs.SABADKHARIDObj,allObjsBU.SABADKHARIDObj,"SABADKHARIDObj")
            
            
            
            whatDoUMean(words)
            // emojiChecker()
            noAnswerF();
            // ajaxPOST ();
            noAsnwerIsGiven = ""
        }, typingTime);
},bot_delay_time)}
let givenAnswer ;
let usedTextList = ''

function mainTalkBotF(y,x,z){
    if (!answerIsGiven) {
        for(let i = 0 ; i< y.questions.length ; i++){
            if(userMessage.includes(y.questions[i])){
                y.listGame = true;
            }
        }
        if(y.listGame){
            let answerIndex = Math.floor(Math.random()*y.allAnswers.length);
            let answer
            answer = y.allAnswers[answerIndex];
            y.listGame = false ;
            answerIsGiven = true ;
            y.listCounter++
            if(y.allAnswers.length > 0){
                y.allAnswers.splice(answerIndex ,1);
            }
            if(y.allAnswers.length < 1){
                y.allAnswers.push(...x.allAnswers)
            }
            givenAnswer = answer;
            sendBotMessage(answer)
            usedTextList = z +" "+ y.listCounter;
        }
    }

}
let noAnswerFOn = false
let noAsnwerIsGiven = ""
function noAnswerF() {
    if(!answerIsGiven){
        let randAnswerIndex
        let randAnswer
        randAnswerIndex = Math.floor(Math.random()*noAnswerList.length);
        randAnswer = noAnswerList[randAnswerIndex];
        answerIsGiven = true ;
        givenAnswer = randAnswer;

        sendBotMessage(randAnswer)
        noAnswerFOn = true
        noAsnwerIsGiven = "XXXXX"
        usedTextList = 'random answer'
    }
}

function userMessageF(){
    let userMessageD = document.createElement("div");
    userMessageD.classList.add("userMessage");
    let userMessageBox = document.createElement("div");
    userMessageBox.classList.add("userMessageBox");
    let userMessageText = document.createElement("h4")
    userMessageText.innerHTML = userMessage
    userMessageBox.appendChild(userMessageText)
    userMessageD.appendChild(userMessageBox)
    if (itsvoiceMessage) {
        userMessageD.innerHTML = `<img width="200em" style="margin: 2em 0;" src="./voiceMessageBlue3.png">`
        itsvoiceMessage = false
    }
    document.getElementById("messagesArea").appendChild(userMessageD)

}
function characterChanger(){
    for(var i=0; i<userMessage2.length; i++) {
        if (userMessage2[i] == 'ي') {
            userMessage += 'ی';
        }
        else if (userMessage2[i] == '‌') {
            userMessage += ' ';
        }
        else {
            userMessage += userMessage2[i];
        }
    }
}
const withEmojis = /\p{Emoji}/u
function emojiChecker(){
    if (!answerIsGiven) {
        var p = /[\u0600-\u06FF\u0698\u067E\u0686\u06AF]/;
        if(!p.test(userMessage) && withEmojis.test(userMessage)){
            answerIsGiven = true ;
            sendBotMessage('ایموجی نفرست نمیتونم ببینم چشم ندارم😢')
            usedTextList = 'dontSendEmoji';
            givenAnswer = 'ایموجی نفرست نمیتونم ببینم چشم ندارم😢'
        }
    }

}

let orderNumber
function editInfo(){
    if(orderCart.orderInProgress){
        doWhatISay('ویرایش اطلاعات')
    }
    else{
        alert("در حال حاضر در حال ثبت سفارش نمی باشید!")
    }
}

function sendBotMessage(messageToSend, c = defaultBotMessageColor, bgc = defaultBotMessageBgColor, maxW = null, elem = "h4"){
    let botMessageD = document.createElement("div");
    botMessageD.classList.add("botMessage");
    let botMessageBox = document.createElement("div");
    botMessageBox.classList.add("botMessageBox");
    maxW ? botMessageBox.style.maxWidth = maxW : 1
    // botMessageBox.style.backgroundColor = bgc
    let botMessageText = document.createElement(elem)
    botMessageText.innerHTML = messageToSend
    botMessageText.style.color = c
    botMessageBox.appendChild(botMessageText)
    botMessageD.appendChild(botMessageBox)
    document.getElementById("messagesArea").appendChild(botMessageD)
    moveMessages(200)
    answerIsGiven = true ;
}

function finalizeTheOrder(){
    if(!orderCart.orderInProgress){
        alert("شما در حال ثبت سفارش نیستید.")
        return
    }
    orderNumber = Math.floor(Math.random() * 900000000) + 100000000
    AjaxAmount()
}



function num3Digit(NUM){
    NUM = NUM + ""
    let NUM2 = ''
    for(let i in NUM){
        if((NUM.length-i-1) % 3 == 0){
            NUM2 += NUM[i] + ","
        }
        else{
            NUM2 += NUM[i]
        }
    }
    if(NUM2[NUM2.length-1] == "," ){
        NUM2 = NUM2.substring(0,NUM2.length-1)
    }
    return NUM2
}
let currentlySearching
let searchingLevel = 0
function searchInProducts(){
    let answer
    if(userMessage.includes("جستجو") || userMessage.includes("جست و جو") || userMessage.includes("جست وجو")){
        currentlySearching = true
        searchingLevel = 1
        console.log(1);
    }
    // let productFound = false
    let productsFound = 0
    if(currentlySearching){
        console.log(2);
        if(searchingLevel == 1){
            console.log(3);
            answer = "لطفا نام محصول مورد نظر را ارسال کنید"
            searchingLevel++
        }
        else if(searchingLevel == 2){
            let productsList2 = ''
            productsFound = 0
            for(let key in fetchObject){
                if(userMessage.toLowerCase().includes(fetchObject[key][headerOfproductName].toLowerCase()) || fetchObject[key][headerOfproductName].toLowerCase().includes(userMessage.toLowerCase()) || similarity(fetchObject[key][headerOfproductName].toLowerCase(), userMessage.toLowerCase()) > 0.6){
                    productsList2 += `<div onclick="productInfo('${key}')" class="galleryElement"><div class="galleryElementImgDiv">${fetchObject[key][headerOfPic][0]}</div><div class="galleryElementText"><h3 ${fetchObject[key][headerOfAmount] > 0 ? "" : 'style="color:red"'}>${fetchObject[key][headerOfproductName]}</h3></div></div>`
                    productsFound++
                }
            }
            let productsList = ""
            if(productsFound > 1){
                productsList = `<div class="galleryHtml">
                <img src="./arrow2.png" style="
                    position: absolute;
                    width: 24px;
                    right: 0;
                    top: 50%;
                    transform: rotate(180deg) translate(5px, -50%);
                    z-index: 99;
                    opacity: 0.7;
                    /* filter: drop-shadow(0px 0px 2px white); */
                    box-shadow: 0px 0px 2px 2px #ffffffcc;
                    background-color: #ffffffba;
                " class="arrowImg">
            <img src="./arrow2.png" style="
                    position: absolute;
                    width: 24px;
                    left: 0;
                    top: 50%;
                    transform: translate(5px, 50%);
                    z-index: 99;
                    opacity: 0.7;
                    /* filter: drop-shadow(0px 0px 2px white); */
                    box-shadow: 0px 0px 2px 2px #ffffffcc;
                    background-color: #ffffffba;
                " class="arrowImg">
                <strong>${productsFound} محصول یافت شد:</strong><div class="gallery"><div class="galleryDiv">`
            }
            else{
                productsList = `<div class="galleryHtml"><strong>${productsFound} محصول یافت شد:</strong><div class="gallery"><div class="galleryDiv">`
            }
            productsList += productsList2

            // if(productsFound > 1){
            //     productsList += '</div>(برای دیدن بقیه محصولات به سمت راست بکشید)</div></div>'
            // }
            // else{
                productsList += '</div></div></div>'
            // }
            answer = productsList
            productsFound > 0 ? 1 : answer = `
            <strong>محصول مورد نظر یافت نشد!</strong><br><div style="height: 12px;"></div>
            <button class="btn btn-primary" onclick="doWhatISay('لیست محصولات')">لیست محصولات</button>
            <button class="btn btn-warning" onclick="doWhatISay('جست و جوی محصولات')">جست و جوی مجدد</button>
            `
            currentlySearching = false
            searchingLevel = 0
        }
        sendBotMessage(answer,"black","white","100%");
        (searchingLevel == 0 && productsFound > 0) ? hideArrows(1) : 1;
        givenAnswer = productsFound > 0 ? "***نتایج جست و جو داده شد***" : "***محصول مورد نظر کاربر یافت نشد***"
        answerIsGiven = true ;
        moveMessages(1)
        usedTextList = "***جست و جوی محصول***";
    }

}

let currentlyCheckingOrder = false
let checkingOrderLevel = 0
let theOrderIsProcessing = false
function checkOrder(){
    return
    let answer
    if(userMessage.includes("پیگیری سفارش")){
        currentlyCheckingOrder = true
        checkingOrderLevel = 1
    }
    if(currentlyCheckingOrder){
        if(checkingOrderLevel == 1){
            answer = "لطفا کد سفارش را ارسال کنید:"
            checkingOrderLevel++
        }
        else if(checkingOrderLevel == 2){
            answer = "در حال بررسی..."
            fetch(prdSheetMain)
            .then(result=>result.text())
            .then(function(csvtext) {
                return csv().fromString(csvtext)
            })
            .then(function(csv){
                checkOrderList = []
                csv.forEach(function(row){
                    if (row.کد_سفارش != ""){
                        // console.log(row.وضعیت_سفارش);
                        checkOrderList.push([row.کد_سفارش , row.وضعیت_سفارش]);
                    }
                })
                let theAnswer
                checkOrderList.forEach(function(item){
                    if(str2Number(item[0]) == str2Number(userMessage)){
                        theAnswer = `<stghj style="color:brown;">وضعیت سفارش شما</stghj>:<hr><strong>` + item[1] + "</strong>"
                        theOrderIsProcessing = true
                    }
                })
                if(!theOrderIsProcessing){
                    theAnswer = "کد سفارشی که دادین اشتباهه یا اینکه هنوز توی سیستم ثبت نشده. اگه مشکلی دارین توی تلگرام یا اینستاگرام با ما در میون بذارین🌹"
                }
                else{
                    theOrderIsProcessing = false
                }
                sendBotMessage(theAnswer)
            }).catch(function(e){
                console.log(e);
                sendBotMessage("اتصال به سرور برقرار نشد. لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.")
                checkingOrderLevel = 0
                currentlyCheckingOrder = false
            })
            checkingOrderLevel = 0
            currentlyCheckingOrder = false
        }

        sendBotMessage(answer)

        givenAnswer = answer
        answerIsGiven = true ;
        moveMessages(1)
        sedTextList = "پیگیری سفارش";
    }
}

const WDYM = [
    {
        Qs : [
            "ارسال",
            "فرستاد",
            "میفرستی",
            "می فرستی",
            "پست",
            "کی سفارش",
            "چه زمانی سفارش",
            "کی"
        ],
        As : [
            "کی ارسال میشه؟",
            "هزینه ارسال چقدره؟"
        ],
        listGame: false,
    },
    {
        Qs:[
            "طول می",
            "آماده",
            "اماده",
            "درست میشه",
            "ساخته",
            "کی سفارش",
            "چه زمانی سفارش",
            "پیگیر"
        ],
        As : [
            "پیگیری سفارش",
            "کی سفارشم حاضر میشه؟"
        ],
        listGame: false,
    }
]

function whatDoUMean(wordsList){
    let helpQs = []
    if(!answerIsGiven){
        WDYM.forEach(function(group){
            group.Qs.forEach(function(Q){
                if(userMessage.includes(Q)){
                    group.listGame = true
                }
                for(let word in wordsList){
                    if(similarity(wordsList[word],Q) > 0.7){
                        console.log(Q + " : " + wordsList[word] + " = "+ similarity(wordsList[word],Q))
                    }    
                    if(similarity(wordsList[word],Q) > 0.7){
                        group.listGame = true
                    }
                }
            })
            if(group.listGame){
                helpQs.push(...group.As)
                group.listGame = false
            }
        })
        if(helpQs.length > 0){
            let answer = `منظورتون یکی از اینا بود؟ :<hr><div style="text-align:center;">`
            helpQs.forEach(function(option){
                let color = helpQs.indexOf(option) % 2 == 0 ? 'info' : 'secondary'
                answer += `<button class="btn btn-${color}" onclick="doWhatISay('${option}')">${option}</button><div style="height:10px"></div>`
            })
            answer += "</div>"
            // helpQs.forEach(function(option){
            //     answer += `<h3 class="btn-success faqClass" onclick="doWhatISay('${option}')">${option}</h3>`
            // })
            sendBotMessage(answer)
            noAnswerFOn = true
            noAsnwerIsGiven = "سوالات کمکی"
            givenAnswer = "*** ربات متوجه سوال نشد! لیست سوالات مشابه داده شد✅ ***";  
            usedTextList = 'سوالات کمکی'
        }
    }
}
function moveMessagesOnInputFocus(){
    const elem = document.querySelector('#whatYouSay');
    if (elem === document.activeElement) {
        moveMessages(500)
    }
}
document.querySelector('#whatYouSay').addEventListener("click",moveMessagesOnInputFocus)

let sessionNumber = Math.floor(Math.random()*1000)
// (A) POST WITH AJAX
function ajaxPOST () {
    var current = new Date();
    let time1 = new Date().toLocaleDateString('fa-IR')+" | "+ current.getHours() +":"+ current.getMinutes() +":"+ current.getSeconds()
    // (A1) DATA
    var data = new FormData();
    data.append( chatColumn1 , userMessage);
    data.append( chatColumn2 , givenAnswer);
    data.append( chatColumn3 , sessionNumber);
    data.append( chatColumn4 , time1);
    data.append( chatColumn5 , noAsnwerIsGiven);
    data.append( chatColumn6 , usedTextList);
    data.append( "sheet" , "chat");
    // (A2) AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", chat_log_link);
    xhr.onload = function () {
    console.log(this.response);
    
    };
    xhr.send(data);
}
function AjaxAmount(){
    let newAmountArray = []
    for(let productId in cartItems){
        newAmountArray.push([productId,cartItems[productId].amount])
    } 
    
    var data = new FormData();
    data.append("newAmounts" , JSON.stringify(newAmountArray));
    data.append("info" , JSON.stringify(info));
    data.append("type" , "reduceAmount");
    // data.append("extraCosts" , JSON.stringify(extraCosts));

    var xhr = new XMLHttpRequest();
    xhr.open("POST", prdApp);
    xhr.onload = function () {
        console.log(this.response);
        let theResponce = JSON.parse(this.response)
        let result = theResponce[0]
        let answer = theResponce[1]
        orderNumber = answer[0]
        orderFee = answer[1]
        if(result.deletedProducts.length == 0 && result.notEnoughAmount.length == 0){
            for(let i in result.successful){
                cartItems[result.successful[i][0]]["oldAmount"] = fetchObject[result.successful[i][0]][headerOfAmount] 
                fetchObject[result.successful[i][0]][headerOfAmount] = result.successful[i][1]
                cartItems[result.successful[i][0]]["newAmount"] = fetchObject[result.successful[i][0]][headerOfAmount] 
            }
            // AjaxOrder()
            let theMessage = `
            <div id="order${orderNumber}ReceiptDiv">
                <table class="table recieptTable table-bordered" dir="rtl">
                    <thead>
                        <tr>
                        <th colspan="3" class="bg-success" style="color: white;">سفارش</th>
                        </tr>
                    </thead>
                    <tbody>`
            
            for(let product in result.successful){
                theMessage += `
                <tr>
                    <td class="table-success">${result.successful[product][6]}</td>
                    <td class="table-success">${result.successful[product][2]} ${result.successful[product][5]}</td>
                    <td class="table-success">${num3Digit(Number(result.successful[product][2]) * Number(result.successful[product][4]))} تومان</td>
                </tr>
                `
            }

            theMessage += `
                        <tr style=" border-top :2px solid #bcd0c7;">
                            <td class="table-success" >${extraCosts.reason}</td>
                            <td class="table-success" colspan="2" >${num3Digit(extraCosts.cost)} تومان</td>
                        </tr>
                        <tr class="bold">
                            <td class="table-success">هزینه سفارش</td>
                            <td class="table-success" colspan="2">${num3Digit(orderFee)} تومان</td>
                        </tr>
                        <tr class="bold">
                            <td class="table-success">کد سفارش</td>
                            <td class="table-success" colspan="2"><span dir="ltr">${num3Digit(orderNumber).replace(",","-").replace(",","-")}</span></td>
                        </tr>
                    </tbody>
                    <thead style="border-top: 2px solid white;">
                        <tr>
                            <th colspan="3" class="bg-primary" style="color:white">پرداخت</th>
                        </tr>
                        </thead>
                    <tbody>
                        <tr>
                            <td class="table-primary">شماره کارت</td>
                            <td class="table-primary" colspan="2"><span dir="ltr">${cardNumber}</span></td>
                    </tr>
                    <tr>
                            <td class="table-primary">به نام</td>
                            <td class="table-primary" colspan="2">${cardNumberOwner}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="orderRecieptBtnsDiv">
                <button class="btn btn-info btn-sm" onclick="downloadReciept('${orderNumber}',this);">دانلود رسید سفارش</button>
                <button class="btn btn-primary btn-sm" onclick="
                updateOrdersStatus();  
                showCart();
                $('#previousOrdersDiv').slideDown(300);
                document.querySelector('#previousOrdersH3Span').style.transform = 'rotate(-90deg)';
                ">مشاهده وضعیت سفارش</button>
            </div>
            <h5 style="text-align:right;" dir="rtl">
                لطفا هزینه سفارش را به شماره کارت بالا واریز کرده و <strong style="color:red;">رسید سفارش</strong> را به همراه <strong style="color:red;">فیش واریز</strong>، به <a href="https://instagram.com/${instagramId.substring(1,100)}" style="text-decoration:none">دایرکت اینستاگرام ما ${instagramId}</a>
                ارسال کنید، تا سفارش شما ثبت نهایی شود.
                <br><br>
                با تشکر از خرید شما🍀
            </h5>
            `
            let ordersObject = JSON.parse(localStorage.getItem("orders"))
            ordersObject ? 1 : ordersObject = {}
            ordersObject[String(orderNumber)] = {
                products : [],
                orderFee : orderFee
            }
            for(let product in result.successful){
                // ordersObject[String(orderNumber)].products.push(fetchObject[productId][headerOfproductName] + `<span style="color:black"> - تعداد: ` + cartItems[productId].amount + " " + fetchObject[productId][headerOfAmountUnit]) + `</span>`
                
                ordersObject[String(orderNumber)].products.push([result.successful[product][6] , result.successful[product][2] + " " + result.successful[product][5]])
            }
            localStorage.setItem("orders", JSON.stringify(ordersObject))
            sendBotMessage(theMessage,"black","white","20em","div")
            orderCart.orderInProgress = false
            orderCart.level = 0
            orderCart.addLevel = 1
            orderCart.productsConfirmed = false
            createReciept(orderNumber)
            cartItems = {}
            updateCart()
            updateTheOrdersList()
        }
        else{
            let answer = "به دلیل عدم موجودی کافی محصولات زیر، سفارش شما ثبت نشد: <hr>"
            for (let i in result.deletedProducts){
                answer += fetchObject[result.deletedProducts[i]][headerOfproductName] + ` - <span style="color : red;">عدم امکان سفارش این محصول</span><br>`
                delete fetchObject[result.deletedProducts[i]]
            }
            for(let i in result.notEnoughAmount){
                fetchObject[result.notEnoughAmount[i][0]][headerOfAmount] = result.notEnoughAmount[i][1]
                answer += fetchObject[result.notEnoughAmount[i][0]][headerOfproductName] + ` - <span style="color : red;">موجودی : ` + fetchObject[result.notEnoughAmount[i][0]][headerOfAmount] + `</span><br>`
            }
            answer += `<hr>لطفا پس از بررسی مجدد سبد خرید خود، جهت تکمیل سفارش اقدام کنید.
            <div style="text-align:center; margin-top:15px;">
                <button class="btn btn-success" onclick="showCart()">مشاهده سبد خرید</button>
            </div>`
            orderCart.orderInProgress = false
            orderCart.level = 0
            orderCart.addLevel = 1
            orderCart.productsConfirmed = false
            sendBotMessage(answer)
            updateCart()
            updateDataBase()
        }
    };
    xhr.onerror = function(){
        let theMessage = `سفارش ثبت نشد. اتصال اینترنت خود را بررسی کرده و دکمه زیر را لمس کنید<br>
        <button onclick="finalizeTheOrder();sendBotMessage('در حال تلاش مجدد...'); this.disabled = true;" class="btn btn-primary" >تلاش مجدد</button>`
        sendBotMessage(theMessage)
    }
    xhr.send(data);
}
let orderFee = 0
function AjaxOrder(){
    return
    orderFee = 0
    var current = new Date();
    let time1 = new Date().toLocaleDateString('fa-IR')+" | "+ current.getHours() +":"+ current.getMinutes() +":"+ current.getSeconds()
    var data = new FormData();
    let orderProductsArray = []
    let orderProductsAll = {
        هزینه : orderFee,
        تعداد : Object.keys(cartItems).length ,
        موجودی : "-",
        زمان : time1
    }
    for(let key in info){
        orderProductsAll[info[key][0]] = info[key][1] 
    }
    orderProductsAll["محصول سفارش"] = "سفارش جدید"
    orderProductsAll["کد سفارش"] =  num3Digit(orderNumber).replace(",","-").replace(",","-")
    let starredRow = JSON.parse(JSON.stringify(orderProductsAll))
    for(let key in starredRow){
        starredRow[key] = `=CHAR(10)&"***"&CHAR(10)`
    }
    orderProductsArray.push(orderProductsAll)
    for(let productId in cartItems){
        orderFee += fetchObject[productId][headerOfPrice] * cartItems[productId].amount
        let orderProduct = {
            هزینه : num3Digit(fetchObject[productId][headerOfPrice] * cartItems[productId].amount),
            تعداد : cartItems[productId].amount + " " + fetchObject[productId][headerOfAmountUnit] ,
            موجودی : cartItems[productId].oldAmount + " => " + cartItems[productId].newAmount,
            زمان : "-"
        }
        orderProduct["محصول سفارش"] = fetchObject[productId][headerOfproductName]
        orderProduct["کد سفارش"] = "-"
        for(let key in info){
            orderProduct[info[key][0]] = "-"
        }
        orderProductsArray.push(orderProduct)        
    }
    orderFee += extraCosts.cost
    orderProductsArray.push(starredRow)
    orderProductsArray[0]["هزینه"] = num3Digit(orderFee)
    let rowsArrayToSend = JSON.stringify(orderProductsArray)

    data.append("rowsArray" , rowsArrayToSend);
    data.append("sheet" , "orders");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", chat_log_link);
    xhr.onload = function () {
        orderCart.orderInProgress = false
        console.log(this.response);
        // let theMessage = `
        //     <div style="margin: 0 5px 0 5px;">
        //         سفارش شما ثبت شد.<hr>
        //         <strong style="color:red">کد سفارش: <span dir="ltr">${num3Digit(orderNumber).replace(",","-").replace(",","-")}</span></strong><br>
        //         <strong style="color:darkgreen">هزینه سفارش: ${num3Digit(orderFee)} تومان</strong><hr>
        //         لطفا هزینه سفارش را به شماره کارت <strong style="color:red" dir="ltr">${cardNumber}</strong> به نام <strong style="color:darkgreen">${cardNumberOwner}</strong> واریز کرده و 
        //         رسید فیش واریزی را به همراه کد سفارش به <a href="https://instagram.com/${instagramId.substring(1,100)}" style="text-decoration:none">دایرکت اینستاگرام ما ${instagramId}</a> ارسال کنید، تا سفارش شما نهایی شود.<br><br>
        //         همچنین میتوانید وضعیت سفارش خود را از قسمت "سفارشات قبلی" مشاهده کنید.
        //         <div style="text-align:center; margin-top: 10px;">
        //             <button class="btn btn-primary" onclick="setTimeout(function(){ $('#ordersBagDiv').slideDown(300, function(){$('#previousOrdersDiv').slideDown(300);document.querySelector('#previousOrdersH3Span').style.transform = 'rotate(-90deg)';})},200); updateOrdersStatus()  ">مشاهده سفارشات قبلی</button>
        //         </div>
        //     </div>
        // `
        let theMessage = `
        <div id="order${orderNumber}ReceiptDiv">
            <table class="table recieptTable" dir="rtl">
                <thead>
                    <tr>
                    <th colspan="2" class="bg-success" style="color: white;">سفارش</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                        <td class="table-success">هزینه سفارش</td>
                        <td class="table-success">${num3Digit(orderFee)} تومان</td>
                    </tr>
                    <tr>
                        <td class="table-success">کد سفارش</td>
                        <td class="table-success"><span dir="ltr">${num3Digit(orderNumber).replace(",","-").replace(",","-")}</span></td>
                    </tr>
                </tbody>
                <thead style="border-top: 2px solid white;">
                    <tr>
                        <th colspan="2" class="bg-primary" style="color:white">پرداخت</th>
                    </tr>
                    </thead>
                <tbody>
                    <tr>
                        <td class="table-primary">شماره کارت</td>
                        <td class="table-primary"><span dir="ltr">${cardNumber}</span></td>
                </tr>
                <tr>
                        <td class="table-primary">به نام</td>
                        <td class="table-primary">${cardNumberOwner}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="orderRecieptBtnsDiv">
            <button class="btn btn-info btn-sm" onclick="downloadReciept('${orderNumber}',this);">دانلود رسید سفارش</button>
            <button class="btn btn-primary btn-sm" onclick="
            updateOrdersStatus();  
            showCart();
            $('#previousOrdersDiv').slideDown(300);
            document.querySelector('#previousOrdersH3Span').style.transform = 'rotate(-90deg)';
            ">مشاهده وضعیت سفارش</button>
        </div>
        <h5 style="text-align:right;" dir="rtl">
            لطفا هزینه سفارش را به شماره کارت بالا واریز کرده و <strong style="color:red;">رسید سفارش</strong> را به همراه <strong style="color:red;">فیش واریز</strong>، به <a href="https://instagram.com/${instagramId.substring(1,100)}" style="text-decoration:none">دایرکت اینستاگرام ما ${instagramId}</a>
            ارسال کنید، تا سفارش شما ثبت نهایی شود.
            <br><br>
            با تشکر از خرید شما🍀
        </h5>
        `
        // orderCart.botMessageElement = "div"
        let ordersObject = JSON.parse(localStorage.getItem("orders"))
        ordersObject ? 1 : ordersObject = {}
        ordersObject[String(orderNumber)] = {
            products : [],
            orderFee : orderFee
        }
        for(let productId in cartItems){
            // ordersObject[String(orderNumber)].products.push(fetchObject[productId][headerOfproductName] + `<span style="color:black"> - تعداد: ` + cartItems[productId].amount + " " + fetchObject[productId][headerOfAmountUnit]) + `</span>`
            ordersObject[String(orderNumber)].products.push([fetchObject[productId][headerOfproductName] , cartItems[productId].amount + " " + fetchObject[productId][headerOfAmountUnit]])
        }
        localStorage.setItem("orders", JSON.stringify(ordersObject))
        sendBotMessage(theMessage,"black","white","20em","div")
        createReciept(orderNumber)
        cartItems = {}
        updateCart()
        updateTheOrdersList()

    }
    xhr.onerror = function(){
        let theMessage = `به دلیل کندی اینترنت، سفارش شما ثبت نشد. لطفا دکمه زیر را لمس کنید تا سفارش دوباره ارسال شود<br>
        <button onclick="AjaxOrder();sendBotMessage('در حال ارسال سفارش...');this.disabled = true;" class="btn btn-primary">تلاش مجدد</button>
        `
        sendBotMessage(theMessage)
    }
    xhr.send(data);
}
function updateOrdersStatus(){
    document.getElementById("previousOrdersDiv").innerHTML = `
    <hr style="margin-top:0;"><h3>در حال بررسی...</h3>
    `
    fetch(staSheet)
    .then(result=>result.text())
    .then(function(csvtext) {
        return csv().fromString(csvtext)
    })
    .then(function(csv){
        console.log(csv);
        checkOrderList = []
        csv.forEach(function(row){
            if (row["کد سفارش"] != ""){
                console.log(row["وضعیت سفارش"]);
                checkOrderList.push([row["کد سفارش"] , row["وضعیت سفارش"]]);
            }
        })
        updateTheOrdersList()
    })
    .catch(function(e){
        console.log(e);
        document.getElementById("previousOrdersDiv").innerHTML = `
        <hr><h5>خطا در اتصال به سرور! لطفا اتصال اینترنت خود را بررسی کرده و دوباره تلاش کنید</h5>
        `
    })

}
function updateTheOrdersList(){
    // console.log("list Updated");
    let ordersObject = JSON.parse(localStorage.getItem("orders"))
    let htmlCode = `
    <p id="prevOrdersGuid">روی سفارش مورد نظر ضربه بزنید</p>
    `
    for(let orderNo in ordersObject){
        let orderStatus = null
        checkOrderList.forEach(function(item){
            if(str2Number(item[0]) == str2Number(orderNo)){
                orderStatus = `<span style="font-weight:bold; color:#c01717;">`+ item[1] + "</span>"
            }
        })
        orderStatus ? 1 : orderStatus = "در انتظار بررسی"
        // htmlCode += `
        // <hr>
        // <h4 style="color: #702686 ; font-weight: bold;">سفارش <span dir="ltr">${ num3Digit(orderNo).replace(",","-").replace(",","-")}</span> :</h4><br>
        // `
        htmlCode += `
        <table class="table table-striped table-bordered" style="
            text-align: center;
            vertical-align: middle;
            font-size: 0.8em;
        ">
            <tbody onclick="hideToggleTableBody(this)" class="table-dark" style="cursor : pointer;">
                <tr>
                    <th colspan="2">سفارش <span dir="ltr">${ num3Digit(orderNo).replace(",","-").replace(",","-")}</span></th>
                </tr>
            </tbody>
            <tbody style="display: none;">
        `
        let products = ordersObject[orderNo].products
        for(let product in products){
            // htmlCode += `<p style="color: red ;">${products[product]}</p><br>`
            htmlCode += `
            <tr>
                <td>${products[product][0]}</td>
                <td>${products[product][1]}</td>
            </tr>
            `
        }
        htmlCode +=`
                <tr>
                    <td class="table-info">هزینه کل</td>
                    <td class="table-info">${num3Digit(ordersObject[orderNo].orderFee)} تومان</td>
                </tr>
                <tr>
                    <td class="table-warning">وضعیت سفارش</td>
                    <td class="table-warning">${orderStatus}</td>
                </tr>
            </tbody>
        </table>
        `
        // htmlCode +=`
        // <p style="color: green ;">${num3Digit(ordersObject[orderNo].orderFee)} تومان</p><br>
        // <p style="color: blue ;">وضعیت : ${orderStatus}</p>
        // `
    }
    ordersObject? 1 : htmlCode = `<hr><h3 style="text-align: center;">شما تابحال سفارشی ثبت نکرده اید.</h3>`
    document.getElementById("previousOrdersDiv").innerHTML = htmlCode
    
    document.getElementById("ordersBagDiv").scrollTo({
        top: document.getElementById("cartDiv").offsetHeight + 2,
        left: 0,
        behavior: 'smooth'
    });
}

// newUser();
function newUser() {
    var current = new Date();
    let time1 = new Date().toLocaleDateString('fa-IR')+" | "+ current.getHours() +":"+ current.getMinutes() +":"+ current.getSeconds()
    // (A1) DATA
    var data = new FormData();
    data.append(chatColumn1 , "##########");
    data.append(chatColumn2 , "کاربر جدید");
    data.append(chatColumn3 , sessionNumber);
    data.append(chatColumn4 , time1);
    data.append(chatColumn6 , "width: "+ screen.availWidth+" | height: "+ screen.availHeight);
    data.append("sheet" , "chat");
    // (A2) AJAX
    var xhr = new XMLHttpRequest();
    xhr.open("POST", chat_log_link);
    xhr.onload = function () {
        console.log(this.response);
    };
    
    xhr.send(data);
}

let itsvoiceMessage = false
let micIcon = document.getElementById("micImage")
let isRecording = false
if ("webkitSpeechRecognition" in window) {
    let speechRecognition = new webkitSpeechRecognition();
    // Speech Recognition Stuff goes here
    speechRecognition.continuous = true;
    speechRecognition.lang = 'fa-IR'
    speechRecognition.onstart = () => {
        document.querySelector("#whatYouSay").setAttribute("placeholder","در حال ضبط صدا...") 
        console.log("starting");
        isRecording = true
        micIcon.className = "recording"
        final_transcript = ''
    };
    speechRecognition.onend = () => {
        document.querySelector("#whatYouSay").setAttribute("placeholder","پیام جدید") 
        console.log("end");
        isRecording = false
        micIcon.className = "micImage"
        micIcon.classList.add("onTextInput22")
        document.querySelector("#threeDotsRecording").classList.add("threeDotsRecording1")
        document.querySelector("#threeDotsRecording").classList.remove("threeDotsRecording2")
        itsvoiceMessage = true
        doWhatISay(final_transcript)
        console.log(final_transcript);
    };
    speechRecognition.onError = () => {
        document.querySelector("#whatYouSay").setAttribute("placeholder","پیام جدید") 
        alert("لطفا از تایپ استفاده کنید.")
        isRecording = false
        micIcon.className = "micImage"
    };

    let final_transcript = "";

    speechRecognition.onresult = (event) => {
        // Create the interim transcript string locally because we don't want it to persist like final transcript
        // Loop through the results from the speech recognition object.
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            }
        }
    };
    micIcon.onclick = () => {
        if(isRecording){
            speechRecognition.stop()
            document.querySelector("#whatYouSay").setAttribute("placeholder","در حال ارسال ویس...") 
            micIcon.className = "waiting"
            document.querySelector("#threeDotsRecording").classList.add("threeDotsRecording2")
            document.querySelector("#threeDotsRecording").classList.remove("threeDotsRecording1")
        }
        else{
            speechRecognition.start()
        }
    };
} else {
console.log("Speech Recognition Not Available")
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
            costs[j] = j;
        else {
            if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
                newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
            }
        }
    }
    if (i > 0)
    costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}
function moveButtons(){
    if(document.querySelector("#whatYouSay").value != ""){
        document.getElementById("sendButtonImage").classList.add("onTextInput1")
        document.getElementById("micImage").classList.add("onTextInput2")
        document.getElementById("sendButtonImage").classList.remove("onTextInput11")
        document.getElementById("micImage").classList.remove("onTextInput22")
    }
    else{
        document.getElementById("sendButtonImage").classList.remove("onTextInput1")
        document.getElementById("micImage").classList.remove("onTextInput2")
        document.getElementById("sendButtonImage").classList.add("onTextInput11")
        document.getElementById("micImage").classList.add("onTextInput22")

    }
}
let headerHidden = false
document.getElementById("hideHeaderBtn").addEventListener("click", function(){
    hideHeader()
})
setTimeout(function(){
    if(!headerHidden && document.getElementById("ordersBagDiv").style.display == "none"){
        hideHeader()
    }
},10000)
function hideHeader(){
    !headerHidden ? document.getElementById("header").style.transform = "translate(0,-4em)" : document.getElementById("header").style.transform = "translate(0,0)"
    !headerHidden ? document.getElementById("hideHeaderBtn").style.transform = "translate(0,-4em)" : document.getElementById("hideHeaderBtn").style.transform = "translate(0,0)"
    !headerHidden ? document.getElementById("hideHeaderBtn").style.opacity = "1" : document.getElementById("hideHeaderBtn").style.opacity = "0.25"
    // !headerHidden ? document.getElementById("hideHeaderBtn").style.height = "35px" : document.getElementById("hideHeaderBtn").style.height = "23px"
    !headerHidden ? document.getElementById("hideHeaderImg").style.transform = "rotate(180deg)translate(0px, 2px)" : document.getElementById("hideHeaderImg").style.transform = "rotate(0deg)translate(0px, -2px)"
    !headerHidden ? document.getElementById("hideHeaderImg").style.filter = "saturate(1)" : document.getElementById("hideHeaderImg").style.filter = "saturate(0.2) "
    !headerHidden ? document.getElementById("hideHeaderBg").style.filter = "saturate(1)" : document.getElementById("hideHeaderBg").style.filter = "saturate(0.2) "
    // !headerHidden ? document.getElementById("cancelOrderTopButtonDiv").style.transform = "translate(-50%,-4em)" : document.getElementById("cancelOrderTopButtonDiv").style.transform = "translate(-50%,0)"
    !headerHidden ? headerHidden = true : headerHidden = false 
}
let typeHidden = false
function hideType(){
    if(typeHidden){
        document.getElementById("type").style.transform = "translate(0,0)"
        document.getElementById("messages").style.paddingBottom = "3.5em"
        typeHidden = false
    }
    else{
        document.getElementById("type").style.transform = "translate(0,3.5em)"
        document.getElementById("messages").style.paddingBottom = "0"
        typeHidden = true
    }
}
$("#previousOrdersH3").click(function(){
    document.getElementById("previousOrdersDiv").style.display != "none" ?  document.querySelector("#previousOrdersH3Span").style.transform = "rotate(0deg)" :  document.querySelector("#previousOrdersH3Span").style.transform = "rotate(-90deg)"
    document.getElementById("previousOrdersDiv").style.display == "none" ? updateOrdersStatus() : 1
    $("#previousOrdersDiv").slideToggle(300)
})
let cartItems = {}
function addToCart(productId){
    if(orderCart.orderInProgress){
        alert("افزودن کالا به سبد خرید در مراحل ثبت سفارش ممکن نیست. لطفا ابتدا سفارش جاری را لغو کنید.")
        return
    }
    if(fetchObject[productId][headerOfAmount] == 0){
        alert("این محصول موجودی ندارد.")
        return
    }
    let cartImg = document.getElementById("ordersBagImg")
    headerHidden ? hideHeader() : 1
    let cartGlowColor = "lime"
    if(!Object.keys(cartItems).includes(productId)){
        cartItems[productId] = {
            amount : 1
        }
        updateCart()
        // sendBotMessage(`${fetchObject[productId][headerOfproductName]} به سبد خرید اضافه شد ✅`)
    }
    else{
        // sendBotMessage(`${fetchObject[productId][headerOfproductName]} قبلا به سبد خرید شما اضافه شده است❗<div style="height: 5px;"></div>
        // <button class="btn btn-success" onclick="showCart()">مشاهده سبد خرید</button>`)
        cartGlowColor = "red"
    }
    setTimeout(function(){
        cartImg.style.filter = `drop-shadow(${cartGlowColor} 0px 0px 3px)`
        cartImg.style.transform = `scaleY(1.1)scaleX(1.1)`
        cartGlowColor == "lime" ? document.getElementById("ordersBagNumber").style.transform =  `rotate(30deg)` : 1
    },500)
    setTimeout(function(){
        cartImg.style.filter = `drop-shadow(0px 0px 1px #4e4e4e80 )`
        cartImg.style.transform = `scaleY(1)scaleX(1)`
        document.getElementById("ordersBagNumber").style.transform =  `rotate(0deg)`
    },1500)
}
function updateCart(){
    localStorage.setItem("cart", JSON.stringify(cartItems)) 
    document.querySelector("#cartDivDiv").innerHTML = ""
    for(let productId in cartItems){
        if(!Object.keys(fetchObject).includes(productId)){
            delete cartItems[productId]
        }
        else if(fetchObject[productId][headerOfAmount] <= 0){
            delete cartItems[productId]
        }
        else if(cartItems[productId].amount > fetchObject[productId][headerOfAmount]){
            cartItems[productId].amount = fetchObject[productId][headerOfAmount]
        }
        
    }
    for(let productId in cartItems){
        document.querySelector("#cartDivDiv").innerHTML += `<div class="cartItem" id="${productId + "Cart"}">
        <img src="./bin.png" class="deleteCartItemBin"
        onclick = "deleteCartItem('${productId}')"
        >
        <img 
        src="${imgTag2Url(fetchObject[productId][headerOfPic][0])}"
        class="cartItemImg"
        onclick = "productInfo('${productId}');hideCart();">
            <h4 onclick = "productInfo('${productId}');hideCart();">${fetchObject[productId][headerOfproductName]}</h4>
            <div class="setAmountDiv">
                <button class="setAmountButton" onclick="changeCartItemAmount('${productId}', 1)">+</button>
                <h3 class="setAmounth3">${cartItems[productId].amount}</h3>
                <button class="setAmountButton" onclick="changeCartItemAmount('${productId}', -1)">-</button>
            </div>
            <h5>هزینه : <span style="font-weight: bold; ">${num3Digit(cartItems[productId].amount * fetchObject[productId][headerOfPrice])} تومان</span></h5>
            <hr>
        </div>`
    }
    Object.keys(cartItems).length == 0 ? document.querySelector("#cartDivDiv").innerHTML = `<h4 style="font-weight:bold; text-align: center;">سبد خرید شما خالی است</h4>` : 1
    Object.keys(cartItems).length == 0 ? document.querySelector("#cartSubmitButton").style.display = "none" : document.querySelector("#cartSubmitButton").style.display = "block"
    document.querySelector("#ordersBagNumber").innerHTML = Object.keys(cartItems).length
    localStorage.setItem("cart", JSON.stringify(cartItems))
}
function changeCartItemAmount(productId, amountToAdd) {
    if(orderCart.orderInProgress){
        alert("تغییر سبد خرید در مراحل ثبت سفارش ممکن نیست. لطفا ابتدا سفارش جاری را لغو کنید.")
        return
    }
    if(amountToAdd == -1){
        cartItems[productId].amount > 1 ? cartItems[productId].amount += amountToAdd : alert("برای حذف محصول آیکون سطل آشغال را لمس کنید")
    }
    else{
        cartItems[productId].amount < fetchObject[productId][headerOfAmount] ? cartItems[productId].amount += amountToAdd : alert("موجودی محصول " + fetchObject[productId][headerOfAmount] + " " + fetchObject[productId][headerOfAmountUnit] + " میباشد")
    }
    updateCart()
}
function deleteCartItem(productId){
    if(orderCart.orderInProgress){
        alert("تغییر سبد خرید در مراحل ثبت سفارش ممکن نیست. لطفا ابتدا سفارش جاری را لغو کنید.")
        return
    }
    document.getElementById("ordersBagImg").style.filter = `drop-shadow(red 0px 0px 3px)`
    setTimeout(function(){
        document.getElementById("ordersBagImg").style.filter = `drop-shadow(0px 0px 1px #4e4e4e80 )`
    },500)
    let theId = "#"+ productId +"Cart"
    $(theId).slideUp(200, function(){
        delete cartItems[productId]
        updateCart()
    })
}

orderCart.botMessageElement = "h4"

function orderCart(){
    let answer
    if(userMessage.includes("تکمیل سفارش") && !orderCart.orderInProgress){
        orderCart.orderInProgress = true
        orderCart.level = 2
        orderCart.addLevel = 1
        orderCart.productsConfirmed = false
        console.log(1);
    }
    if(orderCart.orderInProgress){
        if((orderCart.level == Object.keys(info).length + 4) && (userMessage.includes("ویرایش") || userMessage.includes("تصحیح"))){
            orderCart.level = 3
            orderCart.addLevel = 1
            userMessage = "تایید"
            console.log("ویرایش");
            orderCart.infoConfirmed = false
            var container = document.getElementsByClassName('secondConfirmOrderBtn');
            for(var i in [0,1,2]) {
                container[0].setAttribute("disabled","true")
                container[0].classList.remove("secondConfirmOrderBtn")
            }
        }
        if(Object.keys(cartItems).length == 0){
            answer = "سبد خرید شما خالی است!"
            orderCart.orderInProgress = false
        }
        else if(orderCart.level == 2 ){
            answer = `
            <table class="table table-bordered table-striped table-hover" dir="rtl" style="text-align: center;
            vertical-align: middle;">
                <thead class="table-dark">
                <tr>
                    <th scope="col">محصول</th>
                    <th scope="col">تعداد</th>
                    <th scope="col">قیمت</th>
                </tr>
                </thead>
                <tbody>
            `
            // answer = `
            // <strong>سبد خرید شما:</strong><hr>
            // `
            orderCart.amount = 0
            for(let productId in cartItems){
                answer+=`<tr>
                <td>
                <img src="${imgTag2Url(fetchObject[productId][headerOfPic][0])}" class="cartItemImgConfirmation" onclick="productInfo('${productId}')">
                ${fetchObject[productId][headerOfproductName]}</td>
                <td>${cartItems[productId].amount + "&nbsp" + fetchObject[productId][headerOfAmountUnit]}</td>
                <td>${num3Digit(cartItems[productId].amount * fetchObject[productId][headerOfPrice])}</td>
                </tr>
                `
                // answer += `
                // <div style="margin-bottom:8px;">
                //     <strong style="color:red; margin-bottom : 5px;">${fetchObject[productId][headerOfproductName] + "&nbsp"}</strong>
                //     - تعداد:
                //     ${cartItems[productId].amount + "&nbsp" + fetchObject[productId][headerOfAmountUnit]}
                // </div>
                
                // <span style="font-weight: bold; color:green; ">${num3Digit(cartItems[productId].amount * fetchObject[productId][headerOfPrice])} تومان</span>
                // <hr>
                // `
                orderCart.amount += Number(cartItems[productId].amount * fetchObject[productId][headerOfPrice]) 
            }
            orderCart.amount += extraCosts.cost
            answer += `
            <tr>
            <td colspan="2">${extraCosts.reason}</td>
            <td>${num3Digit(extraCosts.cost)}</td>
            </tr></tbody>
            <tbody>
                <tr>
                    <th colspan="2">هزینه کل:</th>
                    <th>${num3Digit(orderCart.amount)} تومان</th>
                </tr>
            </tbody>
            </table>
            <div style="text-align:center;">
                <button class="btn btn-success" onclick="doWhatISay('تایید');orderCart.productsConfirmed = true;">تایید</button>
                <button class="btn btn-danger" onclick="cancelOrderCart()">لغو</button>
            </div>
            `
            // orderCart.botMessageElement = "div"
            // answer +=`
            // ${extraCosts.reason}: ${num3Digit(extraCosts.cost)} تومان
            // <br>
            // <strong style="color:green; margin-top : 8px; display:block;">هزینه کل: ${num3Digit(orderCart.amount)} تومان </strong>
            // <hr>
            // <button class="firstConfirmBtn btn btn-success" onclick="doWhatISay('تایید')">تایید</button>
            // <button class="firstConfirmBtn btn btn-danger" onclick="cancelOrderCart()">لغو</button>
            // `
            orderCart.level++
            // if(orderCart.infoConfirmed){
            //     orderCart.level = 3 + Object.keys(info).length
            //     orderCart.addLevel = Object.keys(info).length
            //     console.log("info is already confirmed");
            // }
            orderCart.botMessageElement = "div"
        }
        else if(orderCart.level == 2 + orderCart.addLevel ){
            if(!(userMessage == "تایید" || userMessage == "تائید" || userMessage == "بله") && orderCart.addLevel == 1 && !orderCart.productsConfirmed){
                alert("لطفا یکی از دکمه های تایید یا لغو را لمس کنید.")
                answerIsGiven = true
                givenAnswer = "لطفا یکی از دکمه های تایید یا لغو را لمس کنید."
                return
            }
            if(orderCart.infoConfirmed){
                orderCart.level = 3 + Object.keys(info).length
                orderCart.addLevel = Object.keys(info).length
                console.log("info is already confirmed");
                // setTimeout(function(){
                    orderCart()
                // },100)
                return
            }
            orderCart.productsConfirmed = true
            if(orderCart.addLevel != 1){
                info[Object.keys(info)[orderCart.addLevel - 2]][1] = userMessage
            }
            answer = `لطفا ${info[Object.keys(info)[orderCart.addLevel - 1]][0]} خود را ارسال کنید`
            if(orderCart.addLevel < Object.keys(info).length){
                orderCart.addLevel++
            }
            orderCart.level++
        }
        else if(orderCart.level == 3 + Object.keys(info).length ){
            orderCart.infoConfirmed ? 1 : info[Object.keys(info)[orderCart.addLevel - 1]][1] = userMessage
            
            answer = `
            <table class="table table-striped table-bordered" style="text-align:center; vertical-align:middle; max-width:25em;" dir="rtl">
            <tbody>
            `
            for(let key in info){
                // answer += `<div style="margin : 10px"><strong>${info[key][0]}</strong> : ${info[key][1]}</div>`
                answer += `
                <tr>
                    <th>${info[key][0]}</th>
                    <td>${info[key][1]}</td>
                </tr>
                `
            }
            answer += `
            </tbody>
            </table>
            <div style="
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-evenly;
            ">
                <button onclick="doWhatISay('ثبت سفارش')" class="secondConfirmOrderBtn btn btn-success">تایید و ثبت سفارش</button>
                <button onclick="editInfo()" class="secondConfirmOrderBtn btn btn-warning" style="margin:0 5px">ویرایش اطلاعات</button>
                <button onclick="cancelOrderCart()" class="secondConfirmOrderBtn btn btn-danger">لغو سفارش</button>
            </div>
                `
            orderCart.botMessageElement = "div"
            orderCart.level++
        }
        else if(orderCart.level == 4 + Object.keys(info).length ){
            if(userMessage.includes("تایید") || userMessage.includes("تائید") || userMessage.includes("بله") || userMessage.includes("ثبت سفارش")){
                var container = document.getElementsByClassName('secondConfirmOrderBtn');
                for(var i in [0,1,2]) {
                    container[0].setAttribute("disabled","true")
                    container[0].classList.remove("secondConfirmOrderBtn")
                }
                orderCart.infoConfirmed = true
                finalizeTheOrder()
                answer = "در حال ثبت سفارش لطفا صبر کنید..."
                givenAnswer = answer
                orderCart.level = 0
                orderCart.addLevel = 1
            }
            else{
                answer = "لطفا یکی از دکمه های بالا را لمس کنید."
            }
        }
        
        sendBotMessage(answer,"black","white",null,orderCart.botMessageElement)
        orderCart.botMessageElement = "h4"
        givenAnswer = answer
        answerIsGiven = true ;
        moveMessages(1)
        sedTextList = "پیگیری سفارش";
    }
}
function cancelOrderCart(){
    orderCart.orderInProgress ? sendBotMessage("ثبت سفارش لغو شد.","red") : sendBotMessage("شما در حال ثبت سفارش نمی باشید.","red")
    orderCart.orderInProgress = false
    orderCart.level = 0
    orderCart.addLevel = 1
    orderCart.productsConfirmed = false
    var container = document.getElementsByClassName('secondConfirmOrderBtn');
    for(var i in [0,1,2]) {
        container[0].setAttribute("disabled","true")
        container[0].classList.remove("secondConfirmOrderBtn")
    }
}
function showCart(){
    headerHidden ? hideHeader(): 1
    // setTimeout(function (){
        $("#ordersBagDiv").slideDown()
            $("#overlayDiv").fadeIn()    
        
    // },200)
}
function hideCart(){
    !headerHidden ? hideHeader(): 1
    // setTimeout(function (){
        $("#ordersBagDiv").slideUp()
            $("#overlayDiv").fadeOut()    
        
        document.querySelector("#previousOrdersDiv").style.display = "none"
        document.querySelector("#cartH3Span").style.transform = "rotate(0deg)"
        document.querySelector("#previousOrdersH3Span").style.transform = "rotate(0deg)"
    // },200)
}
// $("#header").on("swipe", function(){
//     headerHidden ? 1 : hideHeader()
// })
function imgTag2Url(imgTag){
    if(imgTag.includes("drive.google.com")){
        return imgTag.substring(10,74)
    }
    else{
        console.log(imgTag);
        return imgTag.replace('<img src="',"").replace('" alt="خطا" >',"")
    }
}
function loadCart(){
    let cartLS = JSON.parse(localStorage.getItem("cart"))
    cartLS ? 1 : cartLS = {}
    cartItems = cartLS
    for(let productId in cartItems){
        cartItems[productId].amount = Number(cartItems[productId].amount)
    }
    updateCart()
}

function updateDataBase(){
    dataBase = {}
    for(let key in fetchObject){
        dataBase[fetchObject[key][headerOfCategory]] = []
    }
    for(let key in fetchObject){
        dataBase[fetchObject[key][headerOfCategory]].push(key)
    }
    let productsGroupList = "لطفا روی دسته بندی موردنظر خود ضربه بزنید: <hr>"
    for(let group in dataBase){
        productsGroupList += `<button onclick="showMeThisProductGroup('${group}');" class="btn btn-primary" style="margin: 0.25em;">${group}</button>`
    }
    // To set showing products 
    productsGroupList += "<br>"
    allObjsBU.productListObj.allAnswers = [productsGroupList]
    allObjs.productListObj.allAnswers = [productsGroupList]
}
// let pictureReciepts = {}
function downloadReciept(orderNo,btn){
    btn.setAttribute("disabled","true")
    btn.innerHTML = "...در حال ایجاد تصویر"
    html2canvas(document.getElementById("order"+ orderNo +"ReceiptDiv")).then(function (canvas) {
        var anchorTag = document.createElement("a");
        document.body.appendChild(anchorTag);
        // document.getElementById("previewImg").appendChild(canvas);
        anchorTag.download = "رسید_سفارش" + orderNo +  ".jpg";
        anchorTag.href = canvas.toDataURL();
        anchorTag.target = '_blank';
        anchorTag.click();
        btn.removeAttribute("disabled")
        btn.innerHTML = "دانلود رسید سفارش"
    })
    .catch(function(e){
        console.log(e);
        btn.removeAttribute("disabled")
        btn.innerHTML = "دانلود رسید سفارش"
    })
}
function createReciept(orderNo){
    return
    console.log("create img called");
    html2canvas(document.getElementById("order"+ orderNo +"ReceiptDiv")).then(function (canvas) {
        var anchorTag = document.createElement("a");
        document.body.appendChild(anchorTag);
        // document.getElementById("previewImg").appendChild(canvas);
        anchorTag.download = "filename.jpg";
        anchorTag.href = canvas.toDataURL();
        anchorTag.target = '_blank';
        // anchorTag.click();
        pictureReciepts["order" + orderNo] = anchorTag
        console.log("img created");
    })
    .catch(function(e){
        console.log(e);
    })
}
function hideToggleTableBody(elem){
    setTimeout(function(){
        $("#prevOrdersGuid").slideUp()
    },500)
    elem.nextElementSibling.style.display == 'table-row-group' ? elem.nextElementSibling.style.display = 'none' : elem.nextElementSibling.style.display = 'table-row-group'
}
function hideArrows(i){
    if(i == 0){
        document.querySelectorAll(".galleryDiv")[document.querySelectorAll(".galleryDiv").length -1].addEventListener("scroll",hideArrows1)
    }
    else if(i == 1){
        document.querySelectorAll(".galleryDiv")[document.querySelectorAll(".galleryDiv").length -1].addEventListener("scroll",hideArrows2)    
    }
}
function hideArrows1(target,i){
    console.log("8")
    // console.log(target.target.parentElement.previousElementSibling)
    target.target.previousElementSibling.style.opacity = "0.05"
    target.target.previousElementSibling.previousElementSibling.style.opacity = "0.05"
    target.target.removeEventListener("scroll",hideArrows1)
}
function hideArrows2(target,i){
    console.log("8")
    // console.log(target.target.parentElement.previousElementSibling)
    target.target.parentElement.previousElementSibling.previousElementSibling.style.opacity = "0.05"
    target.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.style.opacity = "0.05"
    target.target.removeEventListener("scroll",hideArrows2)
}
function bounceIt(element){
    element.classList.add( 'animate__animated','animate__rubberBand');
    element.innerHTML = "به سبد خرید اضافه شد"
    element.setAttribute("disabled","true")
}

// function handleAddToCartBtn(productId,btn){
//     addToCart(productId);
//     // bounceIt(btn);
//     // btn.classList.add( 'animate__animated','animate__rubberBand');
//     btn.innerHTML = "اضافه شد"
//         btn.parentElement.style.width = "72px"

//     btn.style.backgroundImage = "linear-gradient(45deg, black, #0c00fb70)"
//     // btn.setAttribute("disabled","true")
//     btn.setAttribute("onclick","1")
//     let secondBtnDiv = document.createElement("div")
//     // secondBtnDiv.style.display = "inline-block"
//     secondBtnDiv.className = "showCartDiv"
//     secondBtnDiv.innerHTML =`
//     <button 
//         class="btn btn-success" 
//         style="color: white;
//             display:none;"
//         onclick="showCart()"
//         >مشاهده سبد خرید</button>`

    
//     animateCSS(btn, 'rubberBand')
//     .then(message=> {
        
//         // console.log(message)
//         btn.parentElement.parentElement.appendChild(secondBtnDiv)
//         secondBtnDiv.style.width = "0px"
//         setTimeout(function(){
//             document.querySelectorAll(".showCartDiv")[document.querySelectorAll(".showCartDiv").length - 1].style.width = "117px"

//         },10)
//         setTimeout(function(){
//             secondBtnDiv.children[0].style.display = "inline-block"
//             secondBtnDiv.children[0].style.setProperty('--animate-duration', '0.3s')
//             animateCSS(secondBtnDiv.children[0],"zoomIn")
//             .then(message =>{
//                 setTimeout(function(){
//                     btn.style.setProperty('--animate-duration', '0.7s')
//                     animateCSS(btn, 'hinge')
//                     .then(m=>{
//                         btn.style.display = "none"
//                         btn.parentElement.style.width = "0px"

//                     })
                    
//                 },500)
//                 // animateCSS(secondBtnDiv,"pulse")
//             })

//         },300)

//     })
// }

// function handleAddToCartBtn(productId,btn){
//     addToCart(productId);
//     // bounceIt(btn);
//     // btn.classList.add( 'animate__animated','animate__rubberBand');
//     btn.innerHTML = "اضافه شد"
//         btn.parentElement.style.width = "72px"

//     btn.style.backgroundImage = "linear-gradient(45deg, black, #0c00fb70)"
//     // btn.setAttribute("disabled","true")
//     btn.setAttribute("onclick","1")
//     let secondBtnDiv = document.createElement("div")
//     // secondBtnDiv.style.display = "inline-block"
//     secondBtnDiv.className = "showCartDiv"
//     secondBtnDiv.innerHTML =`
//     <button 
//         class="btn btn-success" 
//         style="color: white;
//             display:none;"
//         onclick="showCart()"
//         >مشاهده سبد خرید</button>`

    
//     animateCSS(btn, 'rubberBand')
//     .then(message=> {
        
//         // console.log(message)
//         btn.parentElement.parentElement.appendChild(secondBtnDiv)
//         secondBtnDiv.style.width = "0px"
//         setTimeout(function(){
//             document.querySelectorAll(".showCartDiv")[document.querySelectorAll(".showCartDiv").length - 1].style.width = "117px"

//         },10)
//         setTimeout(function(){
//             secondBtnDiv.children[0].style.display = "inline-block"
//             secondBtnDiv.children[0].style.setProperty('--animate-duration', '0.3s')
//             animateCSS(secondBtnDiv.children[0],"zoomIn")
//             // .then(message =>{
//                 // setTimeout(function(){
//                     btn.style.setProperty('--animate-duration', '0.3s')
//                     animateCSS(btn, 'zoomOut')
//                     .then(m=>{
//                         btn.style.display = "none"
                        

//                     })
//                     setTimeout(function(){
//                         btn.parentElement.style.width = "0px"
//                     },50)
                    
                    
//                 // },200)
//                 // animateCSS(secondBtnDiv,"pulse")
//             // })

//         },220)

//     })
// }

function handleAddToCartBtn(productId,btn){
    addToCart(productId);
    // bounceIt(btn);
    // btn.classList.add( 'animate__animated','animate__rubberBand');
    btn.innerHTML = "اضافه شد"
        btn.parentElement.style.width = "72px"

    btn.style.backgroundImage = "linear-gradient(45deg, black, #0c00fb70)"
    // btn.setAttribute("disabled","true")
    btn.setAttribute("onclick","1")
    let secondBtnDiv = document.createElement("div")
    // secondBtnDiv.style.display = "inline-block"
    secondBtnDiv.className = "showCartDiv"
    secondBtnDiv.innerHTML =`
    <button 
        class="btn btn-success" 
        style="color: white;
        display:none;"
        onclick="showCart()"
    >مشاهده سبد خرید</button><div style="height:10px;"></div>
    <button 
        class="btn btn-primary" 
        onclick="doWhatISay('لیست محصولات')"
        style="display:none;
        top:43px;
        right: 5px;"
    >لیست محصولات</button>
        
    `

    
    animateCSS(btn, 'rubberBand')
    .then(message=> {
        btn.style.setProperty('--animate-duration', '0.3s')
                    animateCSS(btn, 'zoomOut')
                    .then(m=>{
                        btn.style.display = "none"
                        btn.parentElement.style.width = "0px"
                        btn.parentElement.style.height = "0px"
                        btn.parentElement.style.display = "none"
                        btn.parentElement.parentElement.style.height = "81px"

                        // console.log(btn.parentElement.parentElement.parentElement.parentElement.parentElement);

                        let isLastMessage = btn.parentElement.parentElement.parentElement.parentElement.parentElement == document.querySelectorAll(".botMessage")[document.querySelectorAll(".botMessage").length - 1] ? true : false
                        // document.getElementById("messages").scrollTo(0, descDiv.parentElement.parentElement.parentElement.offsetTop - 240)
                        isLastMessage ? moveMessages(1) : 1

                        // moveMessages(1)
                        
        setTimeout(function(){
            btn.parentElement.parentElement.appendChild(secondBtnDiv)
        secondBtnDiv.style.width = "0px"
            secondBtnDiv.style.height = "81px"
            
            document.querySelectorAll(".showCartDiv")[document.querySelectorAll(".showCartDiv").length - 1].style.width = "117px"

        },200)

                    })
        
        // console.log(message)
        
        setTimeout(function(){
            secondBtnDiv.children[0].style.display = "inline-block"
            
            secondBtnDiv.children[0].style.setProperty('--animate-duration', '0.15s')
            animateCSS(secondBtnDiv.children[0],"zoomIn")
            .then(m=>{
                
                secondBtnDiv.children[2].style.display = "inline-block";
                
                secondBtnDiv.children[2].style.setProperty('--animate-duration', '0.15s')
            animateCSS(secondBtnDiv.children[2],"zoomIn")
            })
            
            // .then(message =>{
                // setTimeout(function(){
                    
                    // setTimeout(function(){
                        
                    // },50)
                    
                    
                // },200)
                // animateCSS(secondBtnDiv,"pulse")
            // })

        },1)

    })
}


const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = typeof(element) == "string"? document.querySelector(element) : element
        // node.style.display= "inline-block"

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    })

    