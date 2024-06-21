import { render, screen } from "@testing-library/react"
import ProductImageGallery from "../../components/ProductImageGallery"

describe("ProductImageGallery", () => {
  it("should render nothing if given empty array", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it("should render list of images", () => {
    const imageUrls: string[] = ["url1", "url2"]

    render(<ProductImageGallery imageUrls={imageUrls} />)

    const images = screen.getAllByRole("img")
    expect(images).toHaveLength(2)
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url)
    })
  })
})
