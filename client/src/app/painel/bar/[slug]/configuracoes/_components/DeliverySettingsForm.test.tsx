import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeliverySettingsForm } from "./DeliverySettingsForm";
import { updateDeliverySettings } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { AccessPlan, IBar } from "@/data/models";

jest.mock("../actions", () => ({
  updateDeliverySettings: jest.fn(),
}));

jest.mock("@/utils/toast-ui", () => ({
  appToast: { success: jest.fn(), error: jest.fn() },
}));

const mockedUpdate = updateDeliverySettings as jest.MockedFunction<typeof updateDeliverySettings>;

function buildBar(overrides: Partial<IBar> = {}): IBar {
  return {
    id: "bar-1",
    name: "Bar do João",
    slug: "bar-do-joao",
    address: "Rua Teste, 1",
    accessPlan: AccessPlan.BASIC,
    isActive: true,
    comandasEnabled: true,
    deliveryEnabled: false,
    deliveryFee: 0,
    minOrderValue: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("DeliverySettingsForm", () => {
  beforeEach(() => {
    mockedUpdate.mockReset();
    mockedUpdate.mockResolvedValue({ success: true });
  });

  it("does not show delivery fields until delivery is enabled", () => {
    render(<DeliverySettingsForm bar={buildBar({ deliveryEnabled: false })} slug="bar-do-joao" />);

    expect(screen.queryByLabelText(/taxa de entrega/i)).not.toBeInTheDocument();
  });

  it("shows delivery fields once the delivery switch is on", () => {
    render(<DeliverySettingsForm bar={buildBar({ deliveryEnabled: true })} slug="bar-do-joao" />);

    expect(screen.getByLabelText(/taxa de entrega/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pedido mínimo/i)).toBeInTheDocument();
  });

  it("saves the current field values when the save button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <DeliverySettingsForm
        bar={buildBar({ deliveryEnabled: true, deliveryFee: 5, minOrderValue: 20 })}
        slug="bar-do-joao"
      />,
    );

    const feeInput = screen.getByLabelText(/taxa de entrega/i);
    await user.clear(feeInput);
    await user.type(feeInput, "7.5");

    await user.click(screen.getByRole("button", { name: /salvar configurações/i }));

    await waitFor(() =>
      expect(mockedUpdate).toHaveBeenCalledWith(
        "bar-1",
        "bar-do-joao",
        expect.objectContaining({ deliveryEnabled: true, deliveryFee: 7.5, minOrderValue: 20 }),
      ),
    );
  });

  it("shows an error toast when the save fails", async () => {
    mockedUpdate.mockResolvedValue({ success: false, error: "Falha ao salvar" });
    const user = userEvent.setup();

    render(<DeliverySettingsForm bar={buildBar()} slug="bar-do-joao" />);
    await user.click(screen.getByRole("button", { name: /salvar configurações/i }));

    await waitFor(() => expect(appToast.error).toHaveBeenCalledWith("Falha ao salvar"));
  });
});
