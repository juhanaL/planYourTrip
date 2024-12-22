import { test, expect, describe, beforeEach } from "@playwright/test"

describe("Todo page", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/weathermap")
  })

  test("weather page can be opened", async ({ page }) => {
    const weatherMap = await page.getByText("© OpenStreetMap")
    const tempText = await page.getByText("Temperature:")
    const timeText = await page.getByText("Local time:")
    const nameText = await page.getByText("Weather in Helsinki")
    const img = await page.getByRole("img", {
      name: "Webcam from defined location",
    })

    await expect(weatherMap).toBeVisible()
    await expect(tempText).toBeVisible()
    await expect(timeText).toBeVisible()
    await expect(nameText).toBeVisible()
    await expect(img).toBeVisible()
  })

  test("clicking weather map gets data for new location", async ({ page }) => {
    const weatherMap = await page
      .getByTestId("main-content")
      .locator("div")
      .filter({ hasText: "+− Leaflet | © OpenStreetMap" })
      .nth(1)

    const tempText = await page.getByText("Temperature:")
    const timeText = await page.getByText("Local time:")
    const nameText = await page.getByText("Weather in Helsinki")
    const img = await page.getByRole("img", {
      name: "Webcam from defined location",
    })

    await expect(weatherMap).toBeVisible()
    await expect(tempText).toBeVisible()
    await expect(timeText).toBeVisible()
    await expect(nameText).toBeVisible()
    await expect(img).toBeVisible()

    await weatherMap.click({ position: { x: 200, y: 200 } })

    const newNameText = await page.getByText("Weather in Engerdal")

    await expect(weatherMap).toBeVisible()
    await expect(tempText).toBeVisible()
    await expect(timeText).toBeVisible()
    await expect(newNameText).toBeVisible()
    await expect(img).toBeVisible()
  })
})
