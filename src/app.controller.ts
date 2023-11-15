import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import puppeteer from 'puppeteer';
import fs = require('fs');
import { join } from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async generatePdf() {
    console.log('estamos en generacion pdf');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    let html = fs.readFileSync(
      join(__dirname, '..', 'src/template', "template.html"),
      "utf-8"
    );
    // html = this.getString(html, datos);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.emulateMediaType('screen');
    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36')

    const pdf = await page.pdf({
      // path: 'finiquito.pdf',
      margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
      printBackground: true,
      format: 'a4',
    });
    console.log(pdf);
  }
}
