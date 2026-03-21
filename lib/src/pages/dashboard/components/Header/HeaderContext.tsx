import { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderInfo {
    title?: string;
    subtitle?: string;
    icon?: React.ElementType;
    iconColor?: string;
    searchPlaceholder?: string;
    showSearch?: boolean;
    showPrimaryAction?: boolean;
    primaryActionLabel?: string | ReactNode;
    primaryActionIcon?: React.ElementType;
    onPrimaryAction?: () => void;
    // Secondary Action (e.g., Check Out)
    showSecondaryAction?: boolean;
    secondaryActionLabel?: string;
    secondaryActionIcon?: React.ElementType;
    onSecondaryAction?: () => void;
    onSearch?: (query: string) => void;

    // Custom Actions
    customActions?: React.ReactNode;
    leftActions?: React.ReactNode;

    // New Action Buttons
    showRefresh?: boolean;
    onRefresh?: () => void;
    showFilter?: boolean;
    onFilter?: () => void;
    showExport?: boolean;
    onExport?: () => void;
    isLoading?: boolean;

    // Tabs Support
    tabs?: {
        id: string;
        label: string;
        isActive: boolean;
        onClick: () => void;
    }[];

    hideHeader?: boolean;
}

interface HeaderContextType {
    headerInfo: HeaderInfo;
    setHeaderInfo: (info: HeaderInfo) => void;
}

const HeaderContext = createContext<HeaderContextType>({
    headerInfo: {
        title: 'Dashboard',
        subtitle: 'HR Information System',
        showPrimaryAction: false,
    },
    setHeaderInfo: () => { },
});

export function HeaderProvider({ children }: { children: ReactNode }) {
    const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
        title: 'Dashboard',
        subtitle: 'HR Information System',
    });

    return (
        <HeaderContext.Provider value={{ headerInfo, setHeaderInfo }}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    return useContext(HeaderContext);
}
