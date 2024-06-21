import { render, screen } from "@testing-library/react"
import AuthStatus from "../../components/AuthStatus"
import { mockAuthState } from "../utils"

describe("AuthStatus", () => {
  const renderComponent = () => {
    render(
      <>
        <AuthStatus />
      </>
    )
  }

  it("should render the loading message while fetching auth status", () => {
    mockAuthState({
      isLoading: true,
      isAuthenticated: false,
      user: undefined,
    })

    renderComponent()

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it("should render the login button if the user is not authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: false,
      user: undefined,
    })

    renderComponent()

    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /log out/i })
    ).not.toBeInTheDocument()
  })

  it("should render the user name if authenticated", () => {
    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: { id: 1, name: "Username" },
    })

    renderComponent()

    expect(screen.getByText("Username")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /log in/i })
    ).not.toBeInTheDocument()
  })
})
