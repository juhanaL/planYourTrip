import {
  test,
  expect,
  request,
  describe,
  beforeEach,
  afterAll,
} from "@playwright/test"

describe("Todo page", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http:localhost:3001/api/testing/reset")
    await page.goto("http://localhost:5173/todo")
  })

  test("todo page can be opened", async ({ page }) => {
    const todoHeader = await page.getByText("To Do list")
    const todoButton = await page.getByText("Add To do item")
    const completedHeader = await page.getByText("Completed tasks")

    await expect(todoHeader).toBeVisible()
    await expect(todoButton).toBeVisible()
    await expect(completedHeader).toBeVisible()
  })

  test("new todos can be created", async ({ page }) => {
    const noTodo = await page.getByTestId("todo-item-draggable-false")
    await expect(noTodo).toHaveCount(0)

    const todoButton = await page.getByRole("button", {
      name: "Add To do item",
    })
    await todoButton.click()

    await page.getByTestId("todo-item-draggable-false").waitFor()
    const newTodo = await page.getByTestId("todo-item-draggable-false")
    
    await expect(newTodo).toBeVisible()
  })

  test("todo text be changed", async ({ page }) => {
    const todoButton = await page.getByRole("button", {
      name: "Add To do item",
    })
    await todoButton.click()
    
    const textArea = await page.getByTestId("1-textarea")
    await textArea.fill("New test text")

    await page.getByText("New test text").waitFor()
    const areaWithNewText = page.getByText("New test text")

    await expect(areaWithNewText).toBeVisible()
  })

  test("todo can be deleted", async ({ page }) => {
    const todoButton = await page.getByRole("button", {
      name: "Add To do item",
    })
    await todoButton.click()
    
    await page.getByTestId("todo-item-draggable-false").waitFor()
    const newTodo = await page.getByTestId("todo-item-draggable-false")
    await expect(newTodo).toBeVisible()

    const deleteIcon = await page.getByTestId("1-removeButton")
    await deleteIcon.click()

    await expect(newTodo).toHaveCount(0)
  })

  test("todo can be marked as done", async ({ page }) => {
    const todoButton = await page.getByRole("button", {
      name: "Add To do item",
    })
    await todoButton.click()
    
    const textArea = await page.getByTestId("1-textarea")
    await textArea.fill("New test text")

    await expect(
      page
        .getByTestId("active-todo-container")
        .filter({ hasText: "New test text" })
    ).toBeVisible()

    const checkBox = await page.getByTestId("1-checkbox")
    await checkBox.click()

    await expect(
      page
        .getByTestId("completed-todo-container")
        .filter({ hasText: "New test text" })
    ).toBeVisible()
  })

  test("todos places can be changed", async ({ page }) => {
    const todoButton = await page.getByRole("button", {
      name: "Add To do item",
    })
    await todoButton.click()
    
    const textArea1 = await page.getByTestId("1-textarea")
    await textArea1.fill("Todo 1")

    await todoButton.click()
    
    const textArea2 = await page.getByTestId("2-textarea")
    await textArea2.fill("Todo 2")

    const topItem = await page.getByTestId("todo-item-draggable-false").nth(0)
    const botItem = await page.getByTestId("todo-item-draggable-false").nth(1)
    await expect(topItem).toContainText("Todo 1")
    await expect(botItem).toContainText("Todo 2")

    const sortIcon = await page.getByTestId("1-sortIcon")
    await sortIcon.hover()
    await page.mouse.down()
    await page.mouse.move(200, 400)
    await page.mouse.up()

    await expect(topItem).toContainText("Todo 2")
    await expect(botItem).toContainText("Todo 1")

    await sortIcon.hover()
    await page.mouse.down()
    await page.mouse.move(200, 200)
    await page.mouse.up()

    await expect(topItem).toContainText("Todo 1")
    await expect(botItem).toContainText("Todo 2")
  })
})

afterAll(async ({ request }) => {
  await request.post("http:localhost:3001/api/testing/reset")
})
