import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import CategoryList from "../../components/CategoryList"
import { Category } from "../../entities"
import AllProviders from "../AllProviders"
import { db } from "../mocks/db"
import { simulateDelay, simulateError } from "../utils"

describe("CategoryList", () => {
  const categories: Category[] = []

  beforeAll(() => {
    Array.from([1, 2]).forEach(() => {
      const newCategory = db.category.create()
      categories.push(newCategory)
    })
  })

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id)
    db.category.deleteMany({ where: { id: { in: categoryIds } } })
  })

  const renderComponent = () => {
    render(<CategoryList />, { wrapper: AllProviders })
  }

  it("should render the list of categories", async () => {
    renderComponent()

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))

    const categoryListItems = await screen.findAllByRole("listitem")
    expect(categoryListItems.length).greaterThan(0)

    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument()
    })
  })

  it("should render an loading indicator", async () => {
    simulateDelay("/categories")

    renderComponent()

    expect(await screen.findByText(/loading/i)).toBeInTheDocument()
  })

  it("should render an error message if there is an error", async () => {
    simulateError("/categories")

    renderComponent()

    expect(await screen.findByText(/error/i)).toBeInTheDocument()
  })

  it("should remove the loading indicator after data is fetched", async () => {
    renderComponent()

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })

  it("should remove the loading indicator if data fetching fails", async () => {
    simulateError("/categories")

    renderComponent()

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i))
  })
})
