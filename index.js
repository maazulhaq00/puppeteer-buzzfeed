const puppeteer = require('puppeteer');

let page;

const browserOpenPromise = puppeteer.launch({
	headless: false,
	defaultViewport: null,
	args: ['--start-maximized'],
	timeout: 50000,
});

browserOpenPromise
	.then(function (browser) {
		const pagesArrPromise = browser.pages();
		return pagesArrPromise;
	})
	.then(function (browserPages) {
		page = browserPages[0];
		return page.setDefaultNavigationTimeout(0);
	})
	.then(function () {
		const gotoPromise = page.goto(
			'https://www.buzzfeed.com/nusrat21/things-so-amazing-youll-break-into-song-dance'
		);
		return gotoPromise;
	})
	.then(async function () {
		// sign-in btn

		await page.waitForSelector('.navLoginLink__yYYrw.link__2d6hQ');
		await page.click('.navLoginLink__yYYrw.link__2d6hQ');

		// email

		await page.waitForSelector('#input_identifier');
		await page.type('#input_identifier', 'khan4106443@cloud.neduet.edu.pk');

		// password

		await page.waitForSelector('#input_password');
		await page.type('#input_password', 'neha123');

		await Promise.all([page.click('#signin'), page.waitForNavigation()]);

		await page.goto(
			'https://www.buzzfeed.com/nusrat21/things-so-amazing-youll-break-into-song-dance'
		);
		// signin-with-gmail

		// await page.waitForSelector(
		// 	'a.button.button--social.button--icon.button--google'
		// );
		// await page.click('a.button.button--social.button--icon.button--google');

		// await page.waitForSelector('#identifierId');
		// await page.type('#identifierId','maazulhaq00@gmail.com');

		return page.waitForSelector(
			'.js-subbuzz-wrapper .subbuzz__description .js-skimlink-subtag-modified'
		);
	})
	.then(async function () {
		const pricesArr = await page.evaluate(() => {
			return Array.from(
				document.querySelectorAll(
					'.subbuzz__description p a.js-skimlink-subtag-modified'
				)
			)
				.map((x) => {
					if (x.innerHTML.includes('$') && !x.innerHTML.includes('year')) {
						return x.innerHTML;
					} else {
						return '';
					}
				})
				.filter((x) => x !== '');
		});

		// const attr = await page.$$eval(".js-subbuzz-wrapper .subbuzz__description .js-skimlink-subtag-modified", el => el.map(x => x.getAttribute("price.value")));

		console.log(pricesArr.length);
		console.log(pricesArr);

		for (let i in pricesArr) {
			pricesArr[i] = pricesArr[i].replace('$', '');
			pricesArr[i] = pricesArr[i].replace('+', '');

			if (Number(pricesArr[i]) > 25) {
				console.log(pricesArr[i], true);
				// wishlist-button_wordWrapper__nDRNW
				// `#mod-subbuzz-photoset-${i + 1} div:nth-child(4) div div button`
				await page.waitForSelector(
					'wishlist-button_button__Bkgar.wishlist-button_wishButton__r__5E'
				);

				await page.click(
					'wishlist-button_button__Bkgar.wishlist-button_wishButton__r__5E'
				);
			}
		}
		console.log(pricesArr.length);
		console.log(pricesArr);
	})
	.catch(function (err) {
		console.log(err);
	});

// async function start() {
// 	const browser = await puppeteer.launch({
// 		headless: false,
// 	});

// 	const page = await browser.newPage();
// 	await page.goto(
// 		'https://www.buzzfeed.com/christineforbes/products-shed-a-tear-of-gratitude'
// 	);

// 	let prices = await page.evaluate(
// 		'document.querySelector("a.js-skimlink-subtag-modified").getAttribute("price.value")'
// 	);

// 	console.log(prices);

// 	await browser.close();
// }

// start();
