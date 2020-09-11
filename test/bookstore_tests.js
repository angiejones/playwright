const { chromium } = require('playwright')
const assert = require('assert')
const { Eyes, ClassicRunner, Target, RectangleSize} = require('@applitools/eyes-playwright')

describe('Automation Bookstore', function () {
	let browser,  page
	const eyes = new Eyes(new ClassicRunner())

	before(async () => {
		browser = await chromium.launch()
	})
	after(async () => {
		await browser.close()
	})

	beforeEach(async () => {
		page = await browser.newPage()
		await page.goto('https://automationbookstore.dev/')
	})
	afterEach(async () => {
		await page.close()
		await eyes.abortIfNotClosed()
	})


	it('should have title', async () => {
		assert.equal(await page.innerText('#page-title'), 'Automation Bookstore')
	})

	it('should return one book when exact title is given', async () => {
		await page.fill('#searchBar', 'Agile Testing')
		await page.waitForSelector('li.ui-screen-hidden', { state: 'attached' })

		const visibleBooksSelector = 'li:not(.ui-screen-hidden)'
		const visibleBooks = await page.$$(visibleBooksSelector)
		assert.equal(visibleBooks.length, 1)
		assert.equal(await page.innerText(visibleBooksSelector + ' >> h2'), 'Agile Testing')
	})

	it('should return multiple books when partial title is given', async () => {
		await page.fill('#searchBar', 'test')
		await page.waitForSelector('li.ui-screen-hidden', { state: 'attached' })

		const expectedBooks = [
			'Test Automation in the Real World',
			'Experiences of Test Automation',
			'Agile Testing',
			'How Google Tests Software',
			'Java For Testers']

		const visibleBooksSelector = 'li:not(.ui-screen-hidden)'
		const visibleBooks = await page.$$(visibleBooksSelector)
		assert.equal(visibleBooks.length, expectedBooks.length)
		expectedBooks.forEach(book => async () => {
			assert.equal(await page.innerText(visibleBooksSelector + ' >> h2'), book)
		})
	})

	it('should be visually perfect', async () => {
		await page.fill('#searchBar', 'test')
		await page.waitForSelector('li.ui-screen-hidden', { state: 'attached' })

		//Visual Testing
		await eyes.open(page, 'Automation Bookstore - Playwright', 'Partial Search', new RectangleSize(800, 600))
		await eyes.check(Target.window().fully())
		await eyes.close()
	})
})