import { render, screen } from "@testing-library/react"
import ExpandableText from "../../components/ExpandableText"
import userEvent from "@testing-library/user-event"

describe("ExpandableText", () => {
  const limit = 255
  const longText = "t".repeat(limit + 1)
  const truncatedText = longText.substring(0, limit) + "..."

  it("should display whole text if length is less than 255", () => {
    const text = "Short Text"
    render(<ExpandableText text={text} />)

    expect(screen.getByText(text)).toBeInTheDocument()
  })

  it("should truncate text if longer than 255 characters", () => {
    render(<ExpandableText text={longText} />)

    expect(screen.getByText(truncatedText)).toBeInTheDocument()
    const button = screen.getByRole("button")
    expect(button).toHaveTextContent(/more/i)
  })

  it("should expand text when Show More button clicked", async () => {
    render(<ExpandableText text={longText} />)

    const user = userEvent.setup()
    const button = screen.getByRole("button")
    await user.click(button)

    expect(button).toHaveTextContent(/less/i)
    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it("should collapse text when Show Less button clicked", async () => {
    render(<ExpandableText text={longText} />)
    const user = userEvent.setup()
    const showMorebutton = screen.getByRole("button", { name: /more/i })
    await user.click(showMorebutton)

    const showLessButton = screen.getByRole("button", { name: /less/i })
    await user.click(showLessButton)

    expect(showMorebutton).toHaveTextContent(/more/i)
    expect(screen.getByText(truncatedText)).toBeInTheDocument()
  })

  it("should handle text exactly at the limit", () => {
    const exactText = "t".repeat(255)
    render(<ExpandableText text={exactText} />)

    const textEl = screen.getByRole("article")
    expect(textEl).toBeInTheDocument()
    expect(textEl).toHaveTextContent(exactText)
    expect(exactText.length).toBe(limit)
  })

  it("should handle empty text", () => {
    render(<ExpandableText text="" />)

    const textEl = screen.getByRole("article")
    expect(textEl).toBeInTheDocument()
    expect(textEl).toHaveTextContent("")
  })
})
