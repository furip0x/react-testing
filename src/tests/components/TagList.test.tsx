import { render, screen } from "@testing-library/react"
import TagList from "../../components/TagList"

describe("TagList", () => {
  it("should render tags", async () => {
    render(<TagList />)

    // await waitFor(() => {
    //   const listItems = screen.getAllByRole("listitem")
    //   expect(listItems.length).greaterThan(0)
    // })
    const listItems = await screen.findAllByRole("listitem")
    expect(listItems.length).greaterThan(0)
  })
})
