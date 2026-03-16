import { ITab } from "@/data/models";
import { ApiResponse } from "@/data/types";
import { serverFetch } from "@/lib/api/serverFetch";

export async function PanelBarActions(slug: string): Promise<ITab[]> {
    const response_tabs = await serverFetch(`/tab/by-bar/${slug}`, {
        cache: "no-cache",
    });

    const data_tabs: ApiResponse<ITab[]> = await response_tabs.json();

    return data_tabs.results ?? [];
}