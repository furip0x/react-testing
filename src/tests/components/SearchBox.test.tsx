import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SearchBox from "../../components/SearchBox"

describe("SearchBox", () => {
  const renderComponent = () => {
    const onChange = vi.fn()
    render(<SearchBox onChange={onChange} />)

    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange: onChange,
      user: userEvent.setup(),
    }
  }

  it("should render an input field for searching", () => {
    const { input } = renderComponent()
    expect(input).toBeInTheDocument()
  })

  it("should call onChange when Enter is pressed", async () => {
    const { user, input, onChange } = renderComponent()

    const searchTerm = "Search"
    await user.type(input, searchTerm + "{enter}")
    expect(onChange).toHaveBeenCalledWith(searchTerm)
  })

  it("should not call onChange if the input field is empty", async () => {
    const { user, input, onChange } = renderComponent()

    await user.type(input, "{enter}")
    expect(onChange).not.toHaveBeenCalled()
  })
})
