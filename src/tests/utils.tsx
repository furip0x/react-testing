import { useAuth0 } from "@auth0/auth0-react"
import { render } from "@testing-library/react"
import { HttpResponse, delay, http } from "msw"
import { RouterProvider, createMemoryRouter } from "react-router-dom"
import { User } from "../entities"
import routes from "../routes"
import { server } from "./mocks/service"

export const simulateDelay = (endpoint: string) => {
  server.use(
    http.get(endpoint, async () => {
      await delay()
      return HttpResponse.json([])
    })
  )
}

export const simulateError = (endpoint: string) => {
  server.use(http.get(endpoint, () => HttpResponse.error()))
}

type AuthState = {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | undefined
}

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue("a"),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  })
}

export const navigateTo = (path: string) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [path],
  })

  render(<RouterProvider router={router} />)
}
