export interface SpaceStoreTypes {
    pages: Page[],
    page: Page | null,
    fetchPages: (session: string) => Promise<void>;
    fetchPageById: (uuid: string, session: string) => Promise<void>;
    createPage: (data: Page, session: string) => Promise<void>;
    updatePage: (uuid: string, data: Page, session: string) => Promise<void>;
    setSelectedPage: (page: Page | null) => void;
    loading: boolean;
    error: string | null;
}


export interface Page {
    uuid: string;
    name: string;
    icon: string;
    users: string[];
    blocks: string[];
    isArchived: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}