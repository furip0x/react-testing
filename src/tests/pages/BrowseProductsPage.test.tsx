import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Category, Product } from "../../entities"
import BrowseProducts from "../../pages/BrowseProductsPage"
import AllProviders from "../AllProviders"
import { db } from "../mocks/db"
import { simulateDelay, simulateError } from "../utils"

describe("BroseProducts", () => {
  const categories: Category[] = []
  const products: Product[] = []

  beforeAll(() => {
    Array.from([1, 2]).forEach(() => {
      const category = db.category.create()
      categories.push(category)
      Array.from([1, 2]).forEach(() => {
        products.push(db.product.create({ categoryId: category.id }))
      })
    })
  })

  afterAll(() => {
    const categoryIds = categories.map((category) => category.id)
    db.category.deleteMany({ where: { id: { in: categoryIds } } })

    const productIds = products.map((product) => product.id)
    db.product.deleteMany({ where: { id: { in: productIds } } })
  })

  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders })

    return {
      getProductsSkeleton: () =>
        screen.getByRole("progressbar", {
          name: /products/i,
        }),
      getCategoriesSkeleton: () =>
        screen.getByRole("progressbar", {
          name: /categories/i,
        }),
    }
  }

  it("should show a loading skeleton when fetching categories", () => {
    simulateDelay("/categories")

    const { getCategoriesSkeleton } = renderComponent()

    expect(getCategoriesSkeleton()).toBeInTheDocument()
  })

  it("should hide the loading skeleton after categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent()

    await waitForElementToBeRemoved(getCategoriesSkeleton)
  })

  it("should show a loading skeleton when fetching products", () => {
    simulateDelay("/products")

    const { getProductsSkeleton } = renderComponent()

    expect(getProductsSkeleton()).toBeInTheDocument()
  })

  it("should hide the loading skeleton after products are fetched", async () => {
    const { getProductsSkeleton } = renderComponent()

    await waitForElementToBeRemoved(getProductsSkeleton)
  })

  it("should not render an error if categories cannot be fetched", async () => {
    simulateError("/categories")

    const { getCategoriesSkeleton } = renderComponent()

    await waitForElementToBeRemoved(getCategoriesSkeleton)

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument()
  })

  it("should render an error if products cannot be fetched", async () => {
    simulateError("/products")

    const { getProductsSkeleton } = renderComponent()

    await waitForElementToBeRemoved(getProductsSkeleton)

    expect(await screen.findByText(/error/i)).toBeInTheDocument()
  })

  it("should render Filter by Category as the default value", async () => {
    renderComponent()

    const trigger = await screen.findByRole("combobox")
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveTextContent(/filter/i)
  })

  it("should render categories", async () => {
    renderComponent()

    const trigger = await screen.findByRole("combobox")
    const user = userEvent.setup()
    await user.click(trigger)

    expect(
      await screen.findByRole("option", { name: /all/i })
    ).toBeInTheDocument()
    categories.forEach((cat) => {
      expect(screen.getByRole("option", { name: cat.name })).toBeInTheDocument()
    })
  })

  it("should render products", async () => {
    renderComponent()

    const trigger = await screen.findByRole("combobox")
    const user = userEvent.setup()
    await user.click(trigger)

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  it("should filter products by category", async () => {
    const { getCategoriesSkeleton } = renderComponent()

    await waitForElementToBeRemoved(getCategoriesSkeleton)

    const trigger = await screen.findByRole("combobox")
    const user = userEvent.setup()
    await user.click(trigger)

    const selectedCategory = categories[0]
    const option = screen.getByRole("option", {
      name: selectedCategory.name,
    })
    await user.click(option)

    const products = db.product.findMany({
      where: {
        categoryId: { equals: selectedCategory.id },
      },
    })
    const rows = screen.getAllByRole("row")
    const dataRows = rows.slice(1)
    expect(dataRows).toHaveLength(products.length)

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })

  it("should render all products", async () => {
    const { getCategoriesSkeleton } = renderComponent()

    await waitForElementToBeRemoved(getCategoriesSkeleton)

    const trigger = await screen.findByRole("combobox")
    const user = userEvent.setup()
    await user.click(trigger)

    const option = screen.getByRole("option", {
      name: /all/i,
    })
    await user.click(option)

    const products = db.product.getAll()
    const rows = screen.getAllByRole("row")
    const dataRows = rows.slice(1)
    expect(dataRows).toHaveLength(products.length)

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
    })
  })
})
