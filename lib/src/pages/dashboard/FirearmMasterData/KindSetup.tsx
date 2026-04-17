import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { useMasterData } from '../MasterDataContext';

export function KindSetup() {
    const { firearmKinds, addFirearmKind, updateFirearmKind, deleteFirearmKind } = useMasterData();

    const [newName,   setNewName]   = useState('');
    const [editId,    setEditId]    = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleAdd = async () => {
        if (!newName.trim()) return;
        await addFirearmKind(newName.trim());
        setNewName('');
    };

    const startEdit  = (id: number, name: string) => { setEditId(id); setEditValue(name); };
    const cancelEdit = () => { setEditId(null); setEditValue(''); };

    const handleUpdate = async () => {
        if (editId === null || !editValue.trim()) return;
        await updateFirearmKind(editId, editValue.trim());
        cancelEdit();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this kind? This cannot be undone.')) return;
        await deleteFirearmKind(id);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-300">
            {/* ── Add Form ─────────────────────────────────────────────────────── */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                    <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Add New Kind</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500">Register a new firearm type/kind in the master data.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">Kind / Type</Label>
                        <div className="flex gap-3">
                            <Input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Enter kind name..."
                                className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-4 focus-visible:ring-blue-100 focus-visible:border-blue-500 transition-all rounded-xl text-slate-800 font-bold shadow-sm"
                                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                            />
                            <Button onClick={handleAdd} className="h-12 px-6 bg-slate-800 text-white font-black rounded-xl hover:bg-slate-900 transition-all shadow-lg hover:-translate-y-0.5">
                                Add
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── List with Edit/Delete ─────────────────────────────────────────── */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Existing Kinds</CardTitle>
                            <CardDescription className="text-xs font-medium text-slate-500">View, edit, or delete current kinds.</CardDescription>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">{firearmKinds.length}</div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {firearmKinds.map(item => (
                            <div key={item.id} className="flex items-center gap-2 p-3 border border-slate-100 rounded-2xl bg-white hover:bg-slate-50 transition-all shadow-sm">
                                {editId === item.id ? (
                                    <>
                                        <Input value={editValue} onChange={e => setEditValue(e.target.value)}
                                            className="h-9 flex-1 rounded-lg text-slate-800 font-bold text-sm"
                                            onKeyDown={e => { if (e.key === 'Enter') handleUpdate(); if (e.key === 'Escape') cancelEdit(); }}
                                            autoFocus />
                                        <button onClick={handleUpdate} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"><Check size={14} /></button>
                                        <button onClick={cancelEdit}   className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><X size={14} /></button>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex-1 font-bold text-slate-700 text-sm">{item.name}</p>
                                        <button onClick={() => startEdit(item.id, item.name)} className="p-2 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"><Pencil size={14} /></button>
                                        <button onClick={() => handleDelete(item.id)}          className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"><Trash2 size={14} /></button>
                                    </>
                                )}
                            </div>
                        ))}
                        {firearmKinds.length === 0 && <p className="text-center text-slate-400 text-sm py-8">No kinds added yet.</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
