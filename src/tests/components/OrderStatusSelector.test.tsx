import { render, screen } from "@testing-library/react"
import OrderStatusSelector from "../../components/OrderStatusSelector"
import { Theme } from "@radix-ui/themes"
import userEvent from "@testing-library/user-event"

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn()

    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    )

    return {
      trigger: screen.getByRole("combobox"),
      getOptions: () => screen.findAllByRole("option"),
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
      onChange,
    }
  }

  it("should render New as the default value", () => {
    const { trigger } = renderComponent()

    expect(trigger).toHaveTextContent(/new/i)
  })

  it("should render with correct values", async () => {
    const { trigger, getOptions } = renderComponent()
    const user = userEvent.setup()
    await user.click(trigger)

    const options = await getOptions()
    expect(options).toHaveLength(3)
    const labels = options.map((label) => label.textContent)
    expect(labels).toEqual(["New", "Processed", "Fulfilled"])
  })

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onChange with $value when the $label option selected",
    async ({ label, value }) => {
      const { trigger, onChange, getOption } = renderComponent()
      const user = userEvent.setup()
      await user.click(trigger)

      const option = await getOption(label)
      await userEvent.click(option)
      expect(onChange).toHaveBeenCalledWith(value)
    }
  )

  it("should call onChange with 'new' when the New option is selected", async () => {
    const { trigger, onChange, getOption } = renderComponent()
    const user = userEvent.setup()
    await user.click(trigger)

    const processedOption = await getOption(/processed/i)
    await userEvent.click(processedOption)

    await user.click(trigger)
    const newOption = await getOption(/new/i)
    await userEvent.click(newOption)
    expect(onChange).toHaveBeenCalledWith("new")
  })
})
