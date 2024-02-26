const puppeteer = require('puppeteer');
const tesseract = require('tesseract.js');
const url = 'https://enlinea.sunedu.gob.pe/';
const dni = "74997020";


(async () => {

    const browser = await puppeteer.launch({headless: false});      
    const page = await browser.newPage();

    await page.setViewport({
        width: 1500,
        height: 1200,
        deviceScaleFactor: 1
      });


    //await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.goto(url);
    
    await page.evaluate(() => {
        const modalClose = document.querySelector("#comunicado .modal-dialog .btnCloseModal");
         modalClose.click();

        const  modal = document.querySelector(".publica .orderLeft a.cil[data-target");
        setTimeout(() => {
            modal.click();
        }, 500);
    });

    let dataPerson = [];

    // Ingresar al contexto del iframe
    const iframe = await page.waitForSelector("#ifrmShowFormConstancias");
    const frame = await iframe.contentFrame();
    await frame.waitForSelector('#doc'); 
    await frame.type('#doc',dni); 

    // Captura de pantalla del captcha
    const img = await frame.waitForSelector('#captchaImg');
    await img.screenshot({ path: `src/img/captcha.jpg` });

    //Convetir imagen a texto
    const imagen = 'src/img/captcha.jpg';
    const { data } = await tesseract.recognize(imagen);
    const textCaptcha = data.text;
  
    await frame.waitForSelector('#captcha'); 
    await frame.type('#captcha',textCaptcha.toUpperCase()); 

    await frame.waitForSelector('#buscar'); 
    await frame.click('#buscar');



    await frame.waitForSelector('#finalData td', {timeout: 600});
    const [graduate, degree, university] = await frame.$$eval('#finalData td', (elemento) => {
        return [elemento[0].textContent, elemento[1].textContent, elemento[2].textContent];
    });
    

    var tmp = {};
    tmp.graduate  = graduate.split('DNI')[0];
    tmp.degree  = degree.split('Fecha')[0];
    tmp.university =  university.split("PERU")[0];

    dataPerson.push(tmp);
    console.log(dataPerson);
    
    


})();