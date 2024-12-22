import { test, expect, beforeEach, describe } from "@playwright/test"

describe("Home page", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173")
  })

  test("front page can be opened", async ({ page }) => {
    const heading = await page.getByRole("heading", {
      name: "Plan your next trip with Plan Your Trip!",
    })

    const weatherMapBox = await page
      .getByTestId("home-page-info-container")
      .filter({ hasText: "Weather map" })

    const tripToDo = await page
      .getByTestId("home-page-info-container")
      .filter({ hasText: "Trip To Do" })

    await expect(heading).toBeVisible()
    await expect(weatherMapBox).toBeVisible()
    await expect(tripToDo).toBeVisible()
  })

  test("click on logo directs back to home page", async ({ page }) => {
    const logo = await page.getByRole("link", {
      name: "Logo with text 'plan your trip'",
    })

    await logo.click()

    const heading = await page.getByRole("heading", {
      name: "Plan your next trip with Plan Your Trip!",
    })

    const weatherMapBox = await page
      .getByTestId("home-page-info-container")
      .filter({ hasText: "Weather map" })

    const tripToDo = await page
      .getByTestId("home-page-info-container")
      .filter({ hasText: "Trip To Do" })

    await expect(heading).toBeVisible()
    await expect(weatherMapBox).toBeVisible()
    await expect(tripToDo).toBeVisible()
  })

  test("click on navbar opens menu and another click closes it", async ({
    page,
  }) => {
    const homeTextButton = await page
      .getByTestId("expanded-navbar")
      .filter({ hasText: "Home" })

    const weatherMapTextButton = await page
      .getByTestId("expanded-navbar")
      .filter({ hasText: "Weather map" })

    const todoTextButton = await page
      .getByTestId("expanded-navbar")
      .filter({ hasText: "Trip To Do" })

    await expect(homeTextButton).toHaveCount(0)
    await expect(weatherMapTextButton).toHaveCount(0)
    await expect(todoTextButton).toHaveCount(0)

    const navToggle = await page.getByLabel("toggle for navigation bar")
    await navToggle.click()

    await expect(homeTextButton).toBeVisible()
    await expect(weatherMapTextButton).toBeVisible()
    await expect(todoTextButton).toBeVisible()

    await navToggle.click()

    await expect(homeTextButton).toHaveCount(0)
    await expect(weatherMapTextButton).toHaveCount(0)
    await expect(todoTextButton).toHaveCount(0)
  })

  test("click on weather map box opens weather map page", async ({ page }) => {
    const weatherMapBox = await page.getByRole("link", { name: "Weather map" })
    await weatherMapBox.click()
    const weatherMap = await page.getByText("© OpenStreetMap")
    await expect(weatherMap).toBeVisible()
  })

  test("click on Trip To Do box opens todo page", async ({ page }) => {
    const todoBox = await page.getByRole("link", { name: "Trip To Do" })
    await todoBox.click()

    const todoHeader = await page.getByText("To Do list")
    const todoButton = await page.getByText("Add To do item")
    const completedHeader = await page.getByText("Completed tasks")
    await expect(todoHeader).toBeVisible()
    await expect(todoButton).toBeVisible()
    await expect(completedHeader).toBeVisible()
  })

  test("click on navbar home selector opens home page", async ({ page }) => {
    const homeIcon = await page.getByTestId("fa-home")
    await homeIcon.click()

    const heading = await page.getByRole("heading", {
      name: "Plan your next trip with Plan Your Trip!",
    })

    const weatherMapBox = await page
      .getByTestId("home-page-info-container")
      .filter({ hasText: "Weather map" })

    const tripToDo = await page
      .getByTestId("home-page-info-container")
      .filter({ hasText: "Trip To Do" })

    await expect(heading).toBeVisible()
    await expect(weatherMapBox).toBeVisible()
    await expect(tripToDo).toBeVisible()
  })

  test("click on navbar weather map selector opens weather map page", async ({
    page,
  }) => {
    const weatherMapIcon = await page.getByTestId("fa-globe")
    await weatherMapIcon.click()

    const weatherMap = await page.getByText("© OpenStreetMap")
    await expect(weatherMap).toBeVisible()
  })

  test("click on navbar todo selector opens todo page", async ({ page }) => {
    const todoIcon = await page.getByTestId("fa-check-square-o")
    await todoIcon.click()

    const todoHeader = await page.getByText("To Do list")
    const todoButton = await page.getByText("Add To do item")
    const completedHeader = await page.getByText("Completed tasks")
    await expect(todoHeader).toBeVisible()
    await expect(todoButton).toBeVisible()
    await expect(completedHeader).toBeVisible()
  })
})
