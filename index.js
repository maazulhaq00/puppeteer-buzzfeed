const puppeteer = require('puppeteer');

async function run() {
	// launch browser
	const browser = await puppeteer.launch({
		headless: false,
		defaultViewport: null,
		args: ['--start-maximized'],
		timeout: 50000,
	});

	// goto buzzfeed
	const browserPages = await browser.pages();
	const page = browserPages[0];
	await page.setDefaultNavigationTimeout(0);
	await page.goto(
		'https://www.buzzfeed.com/nusrat21/things-so-amazing-youll-break-into-song-dance'
	);

	// click sign-in btn
	await page.waitForSelector('.navLoginLink__yYYrw.link__2d6hQ');
	await page.click('.navLoginLink__yYYrw.link__2d6hQ');

	// enter email
	await page.waitForSelector('#input_identifier');
	await page.type('#input_identifier', 'khan4106443@cloud.neduet.edu.pk');

	// enter password
	await page.waitForSelector('#input_password');
	await page.type('#input_password', 'neha123');

	//click sign-in
	await Promise.all([page.click('#signin'), page.waitForNavigation()]);

	// redirected to the buzz
	await page.goto(
		'https://www.buzzfeed.com/nusrat21/things-so-amazing-youll-break-into-song-dance'
	);

	await page.waitForSelector(
		'div.js-subbuzz-wrapper div:nth-child(1) div.subbuzz'
	);

	// array of ids
	const idsArr = await page.evaluate(() => {
		return Array.from(
			document.querySelectorAll(
				'div.js-subbuzz-wrapper div:nth-child(1) div.subbuzz'
			)
		)
			.map((x) => x.id)
			.filter((x) => x !== '');
	});

	// array of prices
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
	console.log(idsArr.length);
	console.log(idsArr);

	// loop for adding subbuzzes with price>$25 to wishlist
	for (let i in pricesArr) {
		pricesArr[i] = pricesArr[i].replace('$', '');
		pricesArr[i] = pricesArr[i].replace('+', '');

		if (Number(pricesArr[i]) > 25) {
			console.log(pricesArr[i], true);
			await page.waitForSelector(
				`#${idsArr[i]} div div div button.wishlist-button_button__Bkgar.wishlist-button_wishButton__r__5E`
			);

			await page.click(
				`#${idsArr[i]} div div div button.wishlist-button_button__Bkgar.wishlist-button_wishButton__r__5E`
			);
		}
	}

	// redirected to wishlist
	await page.waitForSelector(
		'#js-header-container header div div div.wrapper__36hPD div div div.wishlist__CgoSf a'
	);
	await page.click(
		'#js-header-container header div div div.wrapper__36hPD div div div.wishlist__CgoSf a'
	);

	// await browser.close
}

run();
