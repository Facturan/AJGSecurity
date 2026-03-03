import { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderInfo {
    title: string;
    subtitle: string;
    searchPlaceholder?: string;
    showSearch?: boolean;
    showPrimaryAction?: boolean;
    primaryActionLabel?: string;
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
