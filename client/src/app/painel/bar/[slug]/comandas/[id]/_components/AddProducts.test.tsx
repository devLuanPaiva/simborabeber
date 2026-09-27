import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddProducts } from "./AddProducts";
import { addTabItem } from "../actions";
import { appToast } from "@/utils/toast-ui";
import { IProduct, IProductAddon, ProductCategory } from "@/data/models";

jest.mock("../actions", () => ({
  addTabItem: jest.fn(),
}));

jest.mock("@/utils/toast-ui", () => ({
  appToast: { success: jest.fn(), error: jest.fn() },
}));

const mockedAddTabItem = addTabItem as jest.MockedFunction<typeof addTabItem>;

const SLUG = "bar-do-joao";
const TAB_ID = "tab-1";

function buildProduct(overrides: Partial<IProduct> = {}): IProduct {
  return {
    id: "product-1",
    name: "Coca-cola",
    description: "",
    image: "",
    isActive: true,
    price: 8,
    category: ProductCategory.SOFT_DRINKS,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function buildAddon(overrides: Partial<IProductAddon> = {}): IProductAddon {
  return {
    id: "addon-1",
    name: "Borda Catupiry",
    price: 8,
    isActive: true,
    ...overrides,
  };
}

describe("AddProducts", () => {
  beforeEach(() => {
    mockedAddTabItem.mockReset();
    mockedAddTabItem.mockResolvedValue({ success: true, message: "Item adicionado com sucesso" });
  });

  it("adds a product without variants to the comanda immediately when its card is clicked", async () => {
    const user = userEvent.setup();
    render(<AddProducts slug={SLUG} tabId={TAB_ID} products={[buildProduct()]} addonOptions={[]} />);

    await user.click(screen.getByText("Coca-cola"));

    await waitFor(() =>
      expect(mockedAddTabItem).toHaveBeenCalledWith({
        slug: SLUG,
        tabId: TAB_ID,
        item: { productId: "product-1", quantity: 1 },
      }),
    );
    expect(appToast.success).toHaveBeenCalledWith("Item adicionado com sucesso");
  });

  it("opens the size picker instead of adding immediately for a product with variants", async () => {
    const user = userEvent.setup();
    const product = buildProduct({
      id: "pizza-1",
      name: "Calabresa",
      price: undefined,
      category: ProductCategory.PIZZA,
      variants: [{ id: "variant-g", label: "G", price: 45.9, sortOrder: 0, numberOfSlices: 8, isActive: true }],
    });
    render(<AddProducts slug={SLUG} tabId={TAB_ID} products={[product]} addonOptions={[]} />);

    await user.click(screen.getByText("Calabresa"));

    expect(mockedAddTabItem).not.toHaveBeenCalled();
    expect(screen.getByText(/escolha o tamanho/i)).toBeInTheDocument();
  });

  it("adds a product with a chosen size directly from the size picker, with no separate submit step", async () => {
    const user = userEvent.setup();
    const product = buildProduct({
      id: "pizza-1",
      name: "Calabresa",
      price: undefined,
      category: ProductCategory.PIZZA,
      variants: [{ id: "variant-g", label: "G", price: 45.9, sortOrder: 0, numberOfSlices: 8, isActive: true }],
    });
    render(<AddProducts slug={SLUG} tabId={TAB_ID} products={[product]} addonOptions={[]} />);

    await user.click(screen.getByText("Calabresa"));
    await user.click(screen.getByText(/^G ·/));
    await user.click(screen.getByRole("button", { name: /adicionar/i }));

    await waitFor(() =>
      expect(mockedAddTabItem).toHaveBeenCalledWith({
        slug: SLUG,
        tabId: TAB_ID,
        item: { productId: "pizza-1", quantity: 1, variantId: "variant-g" },
      }),
    );
    expect(screen.queryByText(/escolha o tamanho/i)).not.toBeInTheDocument();
  });

  it("shows an error toast when adding the item fails", async () => {
    mockedAddTabItem.mockResolvedValue({ success: false, error: "Erro ao adicionar item" });
    const user = userEvent.setup();
    render(<AddProducts slug={SLUG} tabId={TAB_ID} products={[buildProduct()]} addonOptions={[]} />);

    await user.click(screen.getByText("Coca-cola"));

    await waitFor(() => expect(appToast.error).toHaveBeenCalledWith("Erro ao adicionar item"));
  });

  it("filters the product list by search text", async () => {
    const user = userEvent.setup();
    render(
      <AddProducts
        slug={SLUG}
        tabId={TAB_ID}
        products={[buildProduct(), buildProduct({ id: "product-2", name: "Heineken" })]}
        addonOptions={[]}
      />,
    );

    await user.type(screen.getByPlaceholderText(/buscar produto/i), "hein");

    expect(screen.getByText("Heineken")).toBeInTheDocument();
    expect(screen.queryByText("Coca-cola")).not.toBeInTheDocument();
  });
});
