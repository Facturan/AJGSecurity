import { useState, useEffect, useRef } from 'react';
import { Shield } from 'lucide-react';
import { useParams } from 'react-router';
import { useHeader } from '../components/Header';

// Firearm sub-modules — one file per section
import { LicenseSetup } from './LicenseSetup';
import { ModelSetup }   from './ModelSetup';
import { CaliberSetup } from './CaliberSetup';
import { MakeSetup }    from './MakeSetup';
import { KindSetup }    from './KindSetup';

export function FirearmMasterData() {
    const { setHeaderInfo } = useHeader();
    const params = useParams();

    // Route: /master-data/firearm-setup/*  →  params['*'] = 'license' | 'model' | 'caliber' | 'make' | 'kind'
    const rawSegment = (params['*'] || 'model').split('/')[0].toLowerCase();
    const activeTab  = rawSegment.charAt(0).toUpperCase() + rawSegment.slice(1);

    // ── License-specific state (search + notification bell) ──────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const [notifOpen,  setNotifOpen]  = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Close notification panel when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node))
                setNotifOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Header ───────────────────────────────────────────────────────────────
    useEffect(() => {
        const titles: Record<string, string> = {
            Model:   'FIREARM MODEL',
            Caliber: 'FIREARM CALIBER',
            Make:    'FIREARM MAKE',
            Kind:    'FIREARM KIND',
            License: 'FIREARM LICENSE',
        };
        const subtitles: Record<string, string> = {
            License: 'Fire Arm License Entry',
        };

        setHeaderInfo({
            title:                titles[activeTab]    || 'FIREARM SETUP',
            subtitle:             subtitles[activeTab] ?? 'Global configuration for firearm records',
            icon:                 Shield,
            showSearch:           activeTab === 'License',
            onSearch:             activeTab === 'License' ? setSearchTerm : undefined,
            searchPlaceholder:    'Search by SN, make, or model...',
            showNotificationBell: activeTab === 'License',
            notificationCount:    1,
            onNotificationClick:  () => setNotifOpen(prev => !prev),
            leftActions:          undefined,
            customActions:        undefined,
        });
    }, [activeTab, setHeaderInfo, notifOpen]);

    // ── Render ───────────────────────────────────────────────────────────────
    const renderContent = () => {
        switch (activeTab) {
            case 'License': return <LicenseSetup searchTerm={searchTerm} notifOpen={notifOpen} notifRef={notifRef} />;
            case 'Model':   return <ModelSetup />;
            case 'Caliber': return <CaliberSetup />;
            case 'Make':    return <MakeSetup />;
            case 'Kind':    return <KindSetup />;
            default:        return null;
        }
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <div key={activeTab}>
                {renderContent()}
            </div>
        </div>
    );
}
