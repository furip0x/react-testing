import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import QuantitySelector from "../../components/QuantitySelector"
import { Product } from "../../entities"
import { CartProvider } from "../../providers/CartProvider"

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "Milk",
      price: 10,
      categoryId: 1,
    }

    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    )

    const getAddToCartButton = () =>
      screen.getByRole("button", {
        name: /add to cart/i,
      })

    const getQuantityControls = () => ({
      quantity: screen.getByRole("status"),
      incrementButton: screen.getByRole("button", { name: "+" }),
      decrementButton: screen.getByRole("button", { name: "-" }),
    })

    const user = userEvent.setup()

    const addToCart = async () => {
      const button = getAddToCartButton()
      await user.click(button)
    }

    const incrementQuantity = async () => {
      const { incrementButton } = getQuantityControls()
      await user.click(incrementButton)
    }

    const decrementQuantity = async () => {
      const { decrementButton } = getQuantityControls()
      await user.click(decrementButton)
    }

    return {
      getAddToCartButton,
      addToCart,
      getQuantityControls,
      incrementQuantity,
      decrementQuantity,
    }
  }

  it("should render Add to Cart button", () => {
    const { getAddToCartButton } = renderComponent()

    expect(getAddToCartButton()).toBeInTheDocument()
  })

  it("should add the product to the cart", async () => {
    const { getQuantityControls, addToCart } = renderComponent()

    await addToCart()

    const { quantity, incrementButton, decrementButton } = getQuantityControls()
    expect(quantity).toHaveTextContent("1")
    expect(incrementButton).toBeInTheDocument()
    expect(decrementButton).toBeInTheDocument()
    // expect(getAddToCartButton()).not.toBeInTheDocument()
  })

  it("should increment the quantity", async () => {
    const { getQuantityControls, addToCart, incrementQuantity } =
      renderComponent()

    await addToCart()

    const { quantity } = getQuantityControls()
    await incrementQuantity()

    expect(quantity).toHaveTextContent("2")
  })

  it("should decrement the quantity", async () => {
    const {
      getQuantityControls,
      addToCart,
      incrementQuantity,
      decrementQuantity,
    } = renderComponent()

    await addToCart()

    const { quantity } = getQuantityControls()

    await incrementQuantity()
    expect(quantity).toHaveTextContent("2")

    await decrementQuantity()
    expect(quantity).toHaveTextContent("1")
  })

  it("should remove the product from the cart", async () => {
    const {
      getAddToCartButton,
      getQuantityControls,
      addToCart,
      decrementQuantity,
    } = renderComponent()

    await addToCart()

    const { incrementButton, decrementButton, quantity } = getQuantityControls()

    await decrementQuantity()

    expect(quantity).not.toBeInTheDocument()
    expect(incrementButton).not.toBeInTheDocument()
    expect(decrementButton).not.toBeInTheDocument()
    expect(getAddToCartButton()).toBeInTheDocument()
  })
})
