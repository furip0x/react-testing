import { render, screen } from "@testing-library/react"
import Greet from "../../components/Greet"

describe("Greet", () => {
  it("should render name with the Hello text when it exist", () => {
    render(<Greet name="Furki" />)

    const heading = screen.getByRole("heading")
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/furki/i)
  })

  it("should render login button when name not provided", () => {
    render(<Greet />)

    const heading = screen.getByRole("button")
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/login/i)
  })
})
