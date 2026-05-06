// Shared types for the Firearm Master Data modules

export interface LicenseRecord {
    id?: number;           // Supabase auto-generated PK (undefined for unsaved records)
    serialNo: string;      // DB: serial_no
    kind: string;
    make: string;
    caliber: string;
    model: string;
    dateApproved: string;  // DB: date_approved
    dateExpiry: string;    // DB: date_expiry
    isActive?: boolean;    // DB: is_active (false = soft-deleted / archived)
}

/** Used for firearm attribute lists (Model, Caliber, Make, Kind) */
export interface FirearmAttribute {
    id: number;
    name: string;
}
