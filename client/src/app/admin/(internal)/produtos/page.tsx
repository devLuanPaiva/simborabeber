"use client";
import { ProductDialog } from "@/components/products/ProductDialog";
import { ProductPageHeader } from "@/components/products/ProductPageHeader";
import { ProductsTable } from "@/components/products/ProductsTable";
import Loading from "@/components/shared/Loading";
import { useProduct } from "@/data/contexts";
import { useFetchData } from "@/data/hooks";
import { IProduct } from "@/data/models";
import { Suspense, useCallback, useState } from "react";



export default function ProductPage() {

    const { getProductsByEstablishment, createProductByEstablishment, updateProductByEstablishment } = useProduct()
    const [showDialog, setShowDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState<Partial<IProduct>>({});


    const fetchProducts = useCallback(async () => {
        const response = await getProductsByEstablishment('');
        if (response.error) {
            throw new Error(response.error.detail || 'Erro ao buscar produtos');
        }
        return response.data || [];
    }, [getProductsByEstablishment]);

    const { data: products, refetch, loading, error } = useFetchData(fetchProducts);


    const handleOpenDialog = (product?: IProduct) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ ...product })
        } else {
            setEditingProduct(null);
            setFormData({});
        }

        setShowDialog(true);
    }

    const handleSave = async () => {
        if (editingProduct) {
            await updateProductByEstablishment('', editingProduct.id!, formData);

        } else {
            await createProductByEstablishment(formData);
        }
    }


    const filteredProducts = products?.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Suspense fallback={<Loading />}>
            <ProductPageHeader handleOpenDialog={handleOpenDialog} />
            <ProductsTable
                filteredProducts={filteredProducts || []}
                handleOpenDialog={handleOpenDialog}
                setProductToDelete={setProductToDelete}
                setShowDeleteDialog={setShowDeleteDialog} 
                />

            <ProductDialog
                editingProduct={editingProduct}
                formData={formData}
                setFormData={setFormData}
                handleSave={handleSave}
                setShowDialog={setShowDialog}
                showDialog={showDialog}
            />
        </Suspense>
    )
}