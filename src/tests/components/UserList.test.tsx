import { render, screen } from "@testing-library/react"
import UserList from "../../components/UserList"
import { User } from "../../entities"

describe("UserList", () => {
  it("should not render the user list if the array is empty", () => {
    render(<UserList users={[]} />)

    expect(screen.getByText(/no users/i)).toBeInTheDocument()
  })

  it("should render the user list", () => {
    const userList: User[] = [
      { id: 1, name: "User1" },
      { id: 2, name: "User2" },
    ]

    render(<UserList users={userList} />)

    userList.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute("href", `/users/${user.id}`)
      expect(link).toHaveTextContent(user.name)
    })
  })
})
