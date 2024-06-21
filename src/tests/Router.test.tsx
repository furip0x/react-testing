import { screen } from "@testing-library/react"
import { db } from "./mocks/db"
import { navigateTo } from "./utils"

describe("Router", () => {
  it("should render the homepage for /", () => {
    navigateTo("/")

    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument()
  })

  it("should render the products for /products", () => {
    navigateTo("/products")

    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument()
  })

  it("should render product details page for /products/:id", async () => {
    const product = db.product.create()

    navigateTo("/products/" + product.id.toString())

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument()

    db.product.delete({ where: { id: { equals: product.id } } })
  })

  it("should render the not found page for invalid routes", () => {
    navigateTo("/invalid-route")

    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })

  it("should render the admin page for /admin", async () => {
    navigateTo("/admin")

    expect(
      await screen.findByRole("heading", { name: /admin/i })
    ).toBeInTheDocument()
  })
})
