const puppeteer = require('puppeteer');
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

    // Ingresar al contexto del iframe
    const iframe = await page.waitForSelector("#ifrmShowFormConstancias");
    const frame = await iframe.contentFrame();
    await frame.waitForSelector('#doc'); 
    await frame.type('#doc',dni); 






})();